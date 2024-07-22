function profilerComponent() {
  return {
    profiler: [],
    async loadData() {
      const storedProfiler = localStorage.getItem("profiler");
      if (storedProfiler) {
        this.profiler = JSON.parse(storedProfiler);
      } else {
        const response = await fetch("/profiler.json");
        const data = await response.json();
        this.profiler = data.form; // Assuming `data.form` contains the array you provided
        this.saveToLocalStorage();
      }
    },

    saveToLocalStorage() {
      localStorage.setItem("profiler", JSON.stringify(this.profiler));
    },
  };
}
