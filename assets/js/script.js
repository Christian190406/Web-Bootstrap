
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. ACTIVE NAVBAR
    // =====================================

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(
        "section[id], #skills"
    );

    function setActiveMenu() {
        let currentSection = "home";

        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }
        });
    }


    // =====================================
    // 2. AUTO SCROLL
    // =====================================

    const navbarMenu = document.getElementById("navbarMenu");
    const navbar = document.querySelector(".custom-navbar");

    navLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (!targetSection) return;

            event.preventDefault();

            // Fungsi untuk melakukan scroll
            function scrollToTarget() {

                const navbarHeight = navbar.offsetHeight;

                const targetPosition =
                    targetSection.getBoundingClientRect().top +
                    window.scrollY -
                    navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }

            // Aktifkan menu yang dipilih
            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            this.classList.add("active");

            // Jika navbar mobile sedang terbuka
            if (navbarMenu.classList.contains("show")) {

                navbarMenu.addEventListener(
                    "hidden.bs.collapse",
                    function () {
                        scrollToTarget();
                    },
                    { once: true }
                );

                const collapse =
                    bootstrap.Collapse.getOrCreateInstance(navbarMenu);

                collapse.hide();

            } else {

                scrollToTarget();

            }

        });

    });


    // Memperbarui menu ketika halaman digulir
    window.addEventListener("scroll", setActiveMenu);

    // Menentukan menu aktif saat halaman pertama dibuka
    setActiveMenu();

    
    // =====================================
    // 3. CHART.JS PERFORMANCE
    // =====================================

    const chartCanvas = document.getElementById("myChart");

    if (chartCanvas && typeof Chart !== "undefined") {

        fetch("performance_data.php", {
            cache: "no-store"
        })

        .then(response => {
            if (!response.ok) {
                throw new Error("Gagal mengambil data database");
            }

            return response.json();
        })

        .then(result => {

            if (!Array.isArray(result) || result.length === 0) {
                throw new Error("Data performance kosong");
            }

            // Mengambil kategori dari database
            const labels = result.map(item => item.category);

            // Mengambil persentase dari database
            const percentages = result.map(item =>
                Number(item.percentage)
            );

            // Membuat chart
            new Chart(chartCanvas, {

                type: "doughnut",

                data: {
                    labels: labels,

                    datasets: [{
                        label: "Performance",

                        data: percentages,

                        backgroundColor: [
                            "rgb(255, 138, 61)",
                            "rgb(54, 162, 235)",
                            "rgb(75, 192, 120)"
                        ],

                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            position: "bottom",

                            labels: {
                                color: "#202f3f",
                                padding: 15
                            }
                        },

                        tooltip: {
                            enabled: true,

                            callbacks: {
                                label: function(context) {
                                    return context.label + ": " +
                                        context.parsed + "%";
                                }
                            }
                        }
                    }
                }

            });

        })

        .catch(error => {
            console.error("Performance Chart Error:", error);
        });

    }


});
