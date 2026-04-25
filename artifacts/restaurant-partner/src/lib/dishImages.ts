import lambChops from "@/assets/dishes/lamb-chops.png";
import butterChicken from "@/assets/dishes/butter-chicken.png";
import paneerTikka from "@/assets/dishes/paneer-tikka.png";
import saffronBiryani from "@/assets/dishes/saffron-biryani.png";
import tandooriCauliflower from "@/assets/dishes/tandoori-cauliflower.png";
import truffleNaan from "@/assets/dishes/truffle-naan.png";
import mangoLassi from "@/assets/dishes/mango-lassi.png";
import chiliCheeseKulcha from "@/assets/dishes/chili-cheese-kulcha.png";

export const dishImageMap: Record<string, string> = {
  m1: lambChops,
  m2: butterChicken,
  m3: paneerTikka,
  m4: saffronBiryani,
  m5: tandooriCauliflower,
  m6: truffleNaan,
  m7: mangoLassi,
  m8: chiliCheeseKulcha,
};

export const fallbackDish = paneerTikka;

export const allDishImages = [
  lambChops,
  butterChicken,
  paneerTikka,
  saffronBiryani,
  tandooriCauliflower,
  truffleNaan,
  mangoLassi,
  chiliCheeseKulcha,
];
