import { loadReadme, type TransformerProps } from "@batijs/core";

export default async function getReadme(props: TransformerProps) {
  const content = await loadReadme(props);

  //language=Markdown
  const todo = `
## *Firebase*
- You first need to **[Create a Firebase project](https://firebase.google.com/docs/web/setup#create-project)**.
- Then register your app in the firebase console. **[Register your app](https://firebase.google.com/docs/web/setup#register-app)**
- Copy Firebase project configuration and paste in .env. Example :
\`\`\`sh
VITE_FIREBASE_API_KEY="apiKey",
VITE_FIREBASE_AUTH_DOMAIN="authDomain",
VITE_FIREBASE_PROJECT_ID="projectId",
VITE_FIREBASE_STORAGE_BUCKET="storageBucket",
VITE_FIREBASE_MESSAGING_SENDER_ID="messagingSenderId",
VITE_FIREBASE_APP_ID="appId",
\`\`\`
- Download the Firebase service account from [Your Firebase Project Settings > Service accounts](https://console.firebase.google.com/u/0/project/{firebase-project-id}/settings/serviceaccounts/adminsdk)
- Rename to service-account.json and paste to folder \`/firebase/\`.
- Read more about Firebase Auth at official [firebase auth docs](https://firebase.google.com/docs/auth)
- Read FirebaseUI at [firebaseui-web docs](https://github.com/firebase/firebaseui-web?tab=readme-ov-file#using-firebaseui-for-authentication)
### Setup
\`\`\`sh
npm install
npm run dev
\`\`\`
`;

  content.addTodo(todo);

  return content.finalize();
}
