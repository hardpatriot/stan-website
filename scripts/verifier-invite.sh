#!/usr/bin/env bash
#
# Vérifie que invite.stan-friends.com est intact.
#
# Ce sous-domaine porte les Universal Links et l'App Clip de Stan. Il n'a
# rien à voir avec le site vitrine, mais il vit dans la même zone DNS : tout
# changement de nameservers doit le laisser strictement identique.
#
# À lancer AVANT la bascule DNS, puis APRÈS. Les deux sorties doivent être
# rigoureusement les mêmes.
#
#   bash scripts/verifier-invite.sh
#
set -u

HOTE="invite.stan-friends.com"
CIBLE_ATTENDUE="d66tolty.up.railway.app."
AASA="https://$HOTE/.well-known/apple-app-site-association"

# Empreinte relevée le 6 août 2026, avant la migration vers Cloudflare.
EMPREINTE_REFERENCE="04c8345f8e8c122a1c6df48d79a18a9027ecc2461b8e5bcedba395424cc343ba"

vert()  { printf "  \033[32m✓\033[0m %s\n" "$1"; }
rouge() { printf "  \033[31m✗ %s\033[0m\n" "$1"; ECHECS=$((ECHECS + 1)); }
ECHECS=0

echo
echo "Vérification de $HOTE"
echo "$(date '+%d/%m/%Y à %H:%M')"
echo

# ---------------------------------------------------------------- 1. DNS
echo "1. Résolution DNS"
CIBLE=$(dig +short CNAME "$HOTE" 2>/dev/null | head -1)
if [ "$CIBLE" = "$CIBLE_ATTENDUE" ]; then
  vert "pointe bien sur $CIBLE_ATTENDUE"
else
  rouge "pointe sur « ${CIBLE:-rien} » au lieu de $CIBLE_ATTENDUE"
fi

# Qui répond : Google (avant) ou Cloudflare (après). Les deux sont valables,
# c'est la réponse qui doit être identique, pas celui qui la donne.
NS=$(dig +short NS stan-friends.com 2>/dev/null | head -1)
echo "     serveur de noms actuel : ${NS:-inconnu}"

# ------------------------------------------------- 2. Le fichier d'Apple
echo
echo "2. Fichier Apple (Universal Links et App Clip)"
CODE=$(curl -s -o /tmp/aasa-verif.json -w '%{http_code}' -m 20 "$AASA" 2>/dev/null)
if [ "$CODE" = "200" ]; then
  vert "servi en HTTP 200"
else
  rouge "répond HTTP $CODE — les liens n'ouvriront plus l'app"
fi

EMPREINTE=$(shasum -a 256 /tmp/aasa-verif.json 2>/dev/null | awk '{print $1}')
if [ "$EMPREINTE" = "$EMPREINTE_REFERENCE" ]; then
  vert "contenu identique à la référence"
else
  rouge "le contenu a changé"
  echo "     attendu : $EMPREINTE_REFERENCE"
  echo "     obtenu  : ${EMPREINTE:-rien}"
fi

# Apple refuse une redirection sur ce fichier : elle invaliderait le domaine.
REDIR=$(curl -s -o /dev/null -w '%{num_redirects}' -m 20 "$AASA" 2>/dev/null)
if [ "${REDIR:-0}" = "0" ]; then
  vert "aucune redirection (Apple les refuse sur ce fichier)"
else
  rouge "$REDIR redirection(s) — Apple invalidera le domaine"
fi

# --------------------------------------------- 3. Les chemins de l'App Clip
echo
echo "3. Point d'entrée de l'App Clip"
for CHEMIN in "clip-entry" "clip-entry/ABC123"; do
  C=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "https://$HOTE/$CHEMIN" 2>/dev/null)
  if [ "$C" = "200" ]; then
    vert "/$CHEMIN répond 200"
  else
    rouge "/$CHEMIN répond $C au lieu de 200"
  fi
done

# ------------------------------------------------------------ 4. Certificat
echo
echo "4. Certificat TLS"
CERT=$(echo | openssl s_client -connect "$HOTE:443" -servername "$HOTE" 2>/dev/null \
       | openssl x509 -noout -subject -issuer 2>/dev/null)
if echo "$CERT" | grep -q "CN=$HOTE"; then
  vert "émis pour $HOTE"
else
  rouge "le certificat ne correspond pas à $HOTE"
  echo "$CERT" | sed 's/^/     /'
fi

if echo "$CERT" | grep -qi "let's encrypt"; then
  vert "délivré par Let's Encrypt, donc servi par Railway en direct"
elif echo "$CERT" | grep -qi "cloudflare\|google trust"; then
  rouge "certificat Cloudflare : le sous-domaine est PROXIFIÉ (nuage orange)"
  echo "     → repasse la ligne « invite » en DNS only, nuage gris"
fi

# ------------------------------------------------------------------ Verdict
echo
if [ "$ECHECS" -eq 0 ]; then
  printf "\033[32mTout est intact. Les invitations et l'App Clip fonctionnent.\033[0m\n"
else
  printf "\033[31m%s problème(s). NE PAS résilier Framer, et vérifier la ligne « invite » dans Cloudflare.\033[0m\n" "$ECHECS"
fi
echo
exit "$ECHECS"
