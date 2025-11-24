document.addEventListener('DOMContentLoaded', () => {
    const moviesGrid = document.getElementById('movies-grid');
    const modal = document.getElementById('movie-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const notFoundModal = document.getElementById('not-found-modal');
    const notFoundCloseBtn = document.querySelector('.not-found-close');
    
    // Elementos do Modal para preencher
    const modalTitle = document.getElementById('modal-title');
    const modalYear = document.getElementById('modal-year');
    const modalDirector = document.getElementById('modal-director');
    const modalSynopsis = document.getElementById('modal-synopsis');
    const trailerFrame = document.getElementById('trailer-frame');

    // URL base para imagens ( JSON usa links completos)
    // os links do JSON já são absolutos.
    let allMovies = []; // Armazena todos os filmes para filtrar

    // Função para carregar dados do arquivo JSON
    async function loadMovies() {
        try {
            const response = await fetch('data.json');
            allMovies = await response.json();
            renderMovies(allMovies);
        } catch (error) {
            console.error('Erro ao carregar os filmes:', error);
            moviesGrid.innerHTML = '<p style="color:red; text-align:center;">Erro ao carregar a magia. Verifique se está rodando em um servidor local.</p>';
        }
    }

    // Função para criar os cards na tela
    function renderMovies(movies) {
        moviesGrid.innerHTML = ''; // Limpa a grade antes de renderizar
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('movie-card');
            
            // Se a imagem do JSON estiver vazia, usa um placeholder
            const imageSrc = movie.poster ? movie.poster : 'https://via.placeholder.com/300x450?text=Sem+Imagem';
 
            card.innerHTML = `
                <img src="${imageSrc}" alt="${movie.title}">
                <div class="card-content">
                    <h3>${movie.title}</h3>
                    <p>${movie.year}</p>
                    <button class="btn-details">Ver Detalhes</button>
                </div>
            `;
            
            // Adiciona o evento de clique no botão para abrir o modal
            card.querySelector('.btn-details').addEventListener('click', (event) => {
                // Impede que o clique no botão se propague para outros elementos
                event.stopPropagation(); 
                openModal(movie);
            });

            moviesGrid.appendChild(card);
        });
    }

    // Função para abrir o Modal
    function openModal(movie) {
        modalTitle.textContent = movie.title;
        modalYear.textContent = movie.year;
        modalDirector.textContent = movie.director;
        modalSynopsis.textContent = movie.synopsis;
        
        // Monta URL do embed do YouTube
        // autoplay=1 faz o vídeo começar ao abrir
        trailerFrame.src = `https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&rel=0&showinfo=0`;
        
        modal.style.display = 'flex';
    }

    // Função para fechar o Modal
    function closeModal() {
        modal.style.display = 'none';
        // Importante: Limpar o src do iframe para parar o áudio do vídeo
        trailerFrame.src = '';
    }

    // Função para buscar filmes, ignorando acentos e maiúsculas/minúsculas
    function searchMovies() {
        // Função auxiliar para remover acentos de uma string
        const normalizeText = (text) => {
            return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        };

        const searchTerm = normalizeText(searchInput.value.toLowerCase());
        const filteredMovies = allMovies.filter(movie => {
            const movieTitle = normalizeText(movie.title.toLowerCase());
            return movieTitle.includes(searchTerm);
        });

        if (filteredMovies.length === 0 && searchTerm) {
            notFoundModal.style.display = 'flex';
        } else {
            renderMovies(filteredMovies);
        }
    }

    // Event Listeners
    closeModalBtn.addEventListener('click', closeModal);
    searchButton.addEventListener('click', searchMovies);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });

    // Fechar se clicar fora do conteúdo do modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
        if (e.target === notFoundModal) {
            notFoundModal.style.display = 'none';
        }
    });

    notFoundCloseBtn.addEventListener('click', () => notFoundModal.style.display = 'none');

    // Inicializa
    loadMovies();
});