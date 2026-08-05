        const lines = document.querySelectorAll('.line');
        const observerOptions = { 
            threshold: 0.1,
            rootMargin: "0px 0px -5% 0px" 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        lines.forEach(line => observer.observe(line));