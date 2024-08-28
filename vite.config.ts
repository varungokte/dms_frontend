import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
   },
  plugins: [react()], 
  optimizeDeps:{
    include:[
      '@emotion/react', 
      '@emotion/styled', 
      '@mui/material/Tooltip'
    ]
  },
  resolve: {
    alias: {
      "@mui": path.resolve(__dirname, "./node_modules/@mui"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
