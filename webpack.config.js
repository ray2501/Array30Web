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
    library: {
      name: 'array30',
      type: 'umd',
    },
    path: path.resolve(__dirname, "app"),
  },
};
