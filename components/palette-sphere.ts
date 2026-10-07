// La palette d'emojis de la sphère. Fichier .ts (et non .tsx) : le générateur
// du sprite SVG ne le lit pas, la sphère affichant des images rastérisées
// (public/sphere/emoji), pas le sprite.

/**
 * La palette de la sphère : 110 emojis, un par élément, aucun doublon.
 *
 * Ceux déjà utilisés ailleurs dans la page ouvrent la liste : ils sont déjà
 * définis dans le document, donc ils ne coûtent rien de plus. Le reste est
 * complété par les plus légers du pack, à l'exclusion des pictogrammes
 * d'interface, qui ne ressemblent pas à des emojis.
 */
export const PALETTE = [
  "1st_place_medal", "alarm_clock", "alien", "baguette_bread", "battery",
  "bed", "bell", "beverage_box", "biting_lip", "books", "bread", "briefcase",
  "broken_heart", "clown_face", "cold_face", "cookie", "crescent_moon",
  "crying_face", "desert_island", "drop_of_blood", "ear", "eye", "eyes",
  "face_exhaling", "face_with_open_mouth", "face_with_raised_eyebrow",
  "face_with_tears_of_joy", "face_without_mouth", "fearful_face", "fire",
  "flashlight", "flexed_biceps", "flushed_face", "folded_hands", "foot",
  "french_fries", "game_die", "ghost", "globe_showing_europe_africa",
  "glowing_star", "graduation_cap", "grimacing_face", "grinning_face",
  "grinning_face_with_big_eyes", "grinning_face_with_smiling_eyes",
  "grinning_face_with_sweat", "grinning_squinting_face", "guitar",
  "handshake", "high_voltage", "hourglass_done", "hourglass_not_done",
  "jack_o_lantern", "jeans", "kiss_mark", "kissing_face_with_closed_eyes",
  "light_bulb", "loudly_crying_face", "loudspeaker", "love_letter",
  "low_battery", "lying_face", "magnifying_glass_tilted_left", "man_zombie",
  "microphone", "mirror_ball", "money_bag", "musical_note", "nauseated_face",
  "nerd_face", "old_key", "oncoming_fist", "open_book", "partying_face",
  "pensive_face", "performing_arts", "pisces", "popcorn", "pouting_face",
  "red_heart", "relieved_face", "ring", "robot",
  "rolling_on_the_floor_laughing", "scarf", "school", "shushing_face",
  "skateboard", "skull", "sleeping_face", "smiling_face_with_hearts",
  "smiling_face_with_smiling_eyes", "smirking_face", "sneezing_face",
  "sparkles", "speaking_head", "speech_balloon", "squid", "star",
  "telephone_receiver", "tent", "thong_sandal", "top_hat", "train", "trophy",
  "watch", "weary_face", "winking_face_with_tongue", "wrapped_gift",
  "zany_face",
];
