import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default  {
  entry: "./src/index.js",
  target: "web",
  plugins: [
  ],
  output: {
    filename: "bundle.js",
    library: "array30",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "app"),
  },
};
