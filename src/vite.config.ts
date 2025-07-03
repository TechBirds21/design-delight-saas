export default defineConfig({
   plugins: [react()],
   server: {
     // Removed proxy configuration since we're using mock data
   },
   resolve: {
     alias: {
    }
  }
})