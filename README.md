# Pranay's DSA Flash

A comprehensive React web application for mastering Data Structures and Algorithms with organized problem sets, solutions, and AI-powered assistance using GPT-4.

## 🚀 Features

- **Topic Management**: Organize DSA problems by topics (Arrays, Strings, Trees, Graphs, etc.)
- **Problem Tracking**: Add problems with LeetCode and GeeksforGeeks links
- **Solution Documentation**: Store your solutions with time/space complexity
- **Personal Notes**: Add insights and notes for each problem
- **GPT Integration**: AI-powered explanations and code optimization suggestions
- **Search & Filter**: Find problems and topics quickly
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Local Storage**: Data persists in your browser

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand
- **AI Integration**: OpenAI GPT-4 API
- **Icons**: Heroicons
- **Deployment**: Netlify ready

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pranay-dsa-flash
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🔧 Configuration

### OpenAI API Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `REACT_APP_OPENAI_API_KEY`
3. The app will use GPT-4 for explanations and code reviews

### Customization
- Edit `src/data/topics.json` to modify default topics
- Edit `src/data/problems.json` to add default problems
- Modify `src/index.css` for custom styling

## 📱 Usage

### Adding Topics
1. Click "Add Topic" button
2. Fill in topic name, description, category, and icon
3. Click "Add Topic" to save

### Adding Problems
1. Select a topic from the sidebar
2. Click "Add Problem" button
3. Fill in problem details:
   - Title and difficulty
   - LeetCode and GeeksforGeeks URLs
   - Your solution approach
   - Time and space complexity
   - Tags and notes
4. Click "Add Problem" to save

### Using GPT Assistant
1. Click "Ask GPT" button
2. Type your question about algorithms, optimizations, or concepts
3. Get AI-powered explanations and suggestions

### Managing Content
- Hover over topics/problems to see edit/delete options
- Use the search bar to find specific topics or problems
- All data is stored locally in your browser

## 🚀 Deployment

### Netlify Deployment
1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_OPENAI_API_KEY`

### Environment Variables for Production
Make sure to set `REACT_APP_OPENAI_API_KEY` in your Netlify environment variables.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout component
│   ├── TopicList.tsx   # Topics sidebar
│   ├── ProblemList.tsx # Problems display
│   ├── AddTopicModal.tsx
│   ├── AddProblemModal.tsx
│   └── GPTModal.tsx
├── data/               # Default data
│   ├── topics.json
│   └── problems.json
├── hooks/              # Custom hooks
│   └── useStore.ts     # Zustand store
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   ├── storage.ts      # Local storage management
│   └── gpt.ts          # GPT API integration
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── index.css           # Global styles
```

## 🎨 Customization

### Adding New Icons
1. Import new icons from `@heroicons/react/24/outline`
2. Add them to the `iconMap` in `TopicList.tsx`
3. Update the icon options in `AddTopicModal.tsx`

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/index.css` for global styles
- Use Tailwind classes for component-specific styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## �� License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Powered by OpenAI GPT-4
- Icons from Heroicons

---

**Happy Coding! 🚀**
