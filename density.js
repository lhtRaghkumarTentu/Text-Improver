// const density = require("density");

// density("<b>Hello</b> <i>World</i> hello all").getDensity();
// density("Hello World").getDensity(); //plain text
// density("<b>Hello</b> <i>World</i> hello all").getDensity();

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// // Fetch HTML
// const dom = new JSDOM(
//   `<!DOCTYPE html><p>This is some example text</p> <a>Hi Darling</a>`
// );
// const document = dom.window.document;

// // Get text content
// const text = document.body.textContent;

// // Split text into words
// const words = text.split(" ");

// // Count the frequency of each word
// const wordCount = {};
// words.forEach((word) => {
//   if (wordCount[word]) {
//     wordCount[word]++;
//   } else {
//     wordCount[word] = 1;
//   }
// });

// console.log(wordCount);

// //Calculate density of words
// const totalWords = words.length;

// Object.keys(wordCount).forEach((word) => {
//   wordCount[word] = wordCount[word] / totalWords;
// });
// console.log(wordCount);

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Fetch HTML
const dom = new JSDOM(
  `<!DOCTYPE html><p>This is some Hi Darling example text</p> <a>Hi example Darling</a> <p>example text Hi Some</p>`
);
const document = dom.window.document;

// Get text content
const text = document.body.textContent;

// Split text into words
const words = text.split(" ");

// Count the frequency of each word
let wordCount = [];
words.forEach((word) => {
  if (word.length >= 4) {
    const index = wordCount.findIndex((w) => w.word === word);
    if (index !== -1) {
      wordCount[index].count++;
    } else {
      wordCount.push({ word, count: 1 });
    }
  }
});
wordCount.sort((a, b) => {
  return b.count - a.count;
});

console.log(wordCount);
