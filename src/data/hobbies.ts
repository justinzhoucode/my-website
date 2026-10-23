export type Hobby = {
  id: string;
  name: string;
  images: string[];
  caption: string;
};

export const hobbies: Hobby[] = [
  {
    id: 'keyboards',
    name: 'keyboards',
    images: [
      '/hobbies/img_7345.webp',
      '/hobbies/img_7346.webp',
      '/hobbies/img_3066.webp',
      '/hobbies/keyboard-wood.webp',
    ],
    caption:
      "i'm a big fan of peripherals, keyboards especially. i've built a lot of them and have amassed quite a collection. i'm really happy to say that most of them actually get used by various friends and family!",
  },
  {
    id: 'martha',
    name: 'martha the car',
    images: [
      '/hobbies/martha.webp',
      '/hobbies/img_2865.webp',
      '/hobbies/img_3599.webp',
      '/hobbies/img_2974.webp',
      '/hobbies/img_5259.webp',
      '/hobbies/img_5529.webp',
    ],
    caption:
      "this is martha, a car that was given to me for free after it was abandoned in a buddy's driveway for three years. i love cars and fixing them, and have saved this E70 X5 from the scrapyard. places ive taken it to: nyc, london, waterloo, toronto, and hopefully many more in the future",
  },
  {
    id: 'basketball',
    name: 'basketball',
    images: ['/hobbies/img_6820.webp'],
    caption:
      "i love basketball, i grew up playing it. i'm a big raptors fan and i will emphasize that i was a fan before they won the chip.",
  },
];
