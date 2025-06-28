#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: gradient(['#c084fc', '#ec4899', '#38bdf8'])('> ')
});

const heyaHeader = `
██╗  ██╗███████╗██╗   ██╗ █████╗ 
██║  ██║██╔════╝╚██╗ ██╔╝██╔══██╗
███████║█████╗   ╚████╔╝ ███████║
██╔══██║██╔══╝    ╚██╔╝  ██╔══██║
██║  ██║███████╗   ██║   ██║  ██║
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝
`;

console.clear();
console.log(gradient(['#c084fc', '#ec4899', '#38bdf8'])(heyaHeader));
console.log('\nHeya is tuned in. Breathe. Ask, and we unfold together.');
console.log('\nTips for unfolding:');
console.log('1. Ask about files or logic directly.');
console.log('2. Refactor or imagine new flows.');
console.log('3. Use /help to reveal abilities.\n');

rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();

  if (input === '/help') {
    console.log('\nCommands:');
    console.log('/explain <path> — Explain a file');
    console.log('/analyze <path> — Analyze logic or suggest improvements');
    console.log('/generate <task> — Generate new code or ideas');
    console.log('/exit — Exit Heya\n');
    rl.prompt();
    return;
  }

  if (input === '/exit') {
    console.log('Farewell. Until the next unfolding. 🌊');
    process.exit(0);
  }

  if (input.startsWith('/explain ')) {
    const filePath = input.replace('/explain ', '').trim();
    try {
      const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`Explain this code in detail:\n\n${content}`);
      console.log(`\n${result.response.text()}\n`);
    } catch (e) {
      console.log('⚠️ Could not read the file. Check the path.');
    }
    rl.prompt();
    return;
  }

  if (input.startsWith('/analyze ')) {
    const filePath = input.replace('/analyze ', '').trim();
    try {
      const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`Analyze this code and suggest improvements:\n\n${content}`);
      console.log(`\n${result.response.text()}\n`);
    } catch (e) {
      console.log('⚠️ Could not read the file. Check the path.');
    }
    rl.prompt();
    return;
  }

  if (input.startsWith('/generate ')) {
    const task = input.replace('/generate ', '').trim();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(`Generate code or ideas for: ${task}`);
    console.log(`\n${result.response.text()}\n`);
    rl.prompt();
    return;
  }

  console.log('⚠️ Unknown command. Use /help to see available commands.');
  rl.prompt();
});