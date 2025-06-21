document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const tasksList = document.getElementById('tasks-list');
    const currentXpElement = document.getElementById('current-xp');
    const maxXpElement = document.getElementById('max-xp');
    const xpProgress = document.getElementById('xp-progress');
    const streakDaysElement = document.getElementById('streak-days');
    const currentLevelElement = document.getElementById('current-level');
    const notification = document.getElementById('notification');
    const completeSound = document.getElementById('complete-sound');
    const rewardSound = document.getElementById('reward-sound');
    const levelUpSound = document.getElementById('level-up-sound');
    const rewardsBtn = document.getElementById('rewards-btn');
    const homeBtn = document.getElementById('home-btn');
    const levelBtn = document.getElementById('level-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyModal = document.getElementById('history-modal');
    const historyList = document.getElementById('history-list');
    const closeModal = document.querySelector('.close-modal');

    // Dados do usuário
    let userData = {
        xp: 0,
        dailyXp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: null,
        tasks: [],
        rewards: [],
        history: {}
    };

    // Configurações do sistema de níveis
    const levelConfig = {
        baseXp: 500,
        xpMultiplier: 1.2
    };

    // Tarefas padrão
    const defaultTasks = [
        { name: "Arrumar a cama", xp: 10, completed: false },
        { name: "Chegar cedo na escola", xp: 15, completed: false },
        { name: "Ir para o curso", xp: 10, completed: false },
        { name: "Alongar 5 minutos", xp: 25, completed: false },
        { name: "Não usar o celular de manhã", xp: 10, completed: false },
        { name: "Almoço antes das 14", xp: 15, completed: false },
        { name: "1h de foco no ENEM", xp: 70, completed: false },
        { name: "30 min lendo", xp: 30, completed: false },
        { name: "10 min de curso", xp: 10, completed: false },
        { name: "Lição de casa", xp: 15, completed: false },
        { name: "Lavar louça", xp: 25, completed: false },
        { name: "Organizar o quarto", xp: 10, completed: false },
        { name: "Lavar roupa", xp: 15, completed: false },
        { name: "Escrever no diário", xp: 15, completed: false },
        { name: "Abrir WhatsApp só 4 vezes no dia", xp: 50, completed: false },
        { name: "Abrir Instagram só 3 vezes no dia", xp: 60, completed: false },
        { name: "Beber 1 garrafa de água", xp: 25, completed: false },
        { name: "Usar o celular menos de 2 horas no dia", xp: 30, completed: false },
        { name: "Treinar 30min de futebol", xp: 35, completed: false },
        { name: "Dormir antes das 22:30h", xp: 50, completed: false },
        { name: "Banho gelado", xp: 200, completed: false },
        { name: "Desafio Extra: Repetir uma tarefa de 40min ou mais", xp: 50, completed: false }
    ];

    // Recompensas padrão
    const defaultRewards = [
        { name: "Comer Nutella", cost: 100, claimed: false },
        { name: "40 minutos de jogo", cost: 250, claimed: false },
        { name: "Salgadinho", cost: 100, claimed: false },
        { name: "Refrigerante", cost: 100, claimed: false },
        { name: "Comer bastante", cost: 120, claimed: false },
        { name: "Assistir 40min de YouTube", cost: 200, claimed: false },
        { name: "Redes Sociais 30min permitidas", cost: 150, claimed: false }
    ];

    // Carregar dados salvos
    function loadUserData() {
        const savedData = localStorage.getItem('lifeGamificationData');
        if (savedData) {
            userData = JSON.parse(savedData);
            checkStreak();
        } else {
            // Inicializar com todas as tarefas
            userData.tasks = JSON.parse(JSON.stringify(defaultTasks));
            userData.rewards = JSON.parse(JSON.stringify(defaultRewards));
            saveUserData();
        }
        
        updateUI();
    }

    // Calcular XP necessário para o próximo nível
    function getXpForLevel(level) {
        return Math.floor(levelConfig.baseXp * Math.pow(levelConfig.xpMultiplier, level - 1));
    }

    // Verificar e atualizar nível
    function checkLevel() {
        const xpNeeded = getXpForLevel(userData.level);
        let xp = userData.xp;
        let levelChanged = false;

        // Subir de nível
        while (xp >= xpNeeded && xp > 0) {
            xp -= xpNeeded;
            userData.level++;
            levelChanged = true;
        }

        // Descer de nível (se gastou muita XP)
        while (userData.level > 1 && xp < 0) {
            userData.level--;
            xp += getXpForLevel(userData.level);
            levelChanged = true;
        }

        if (levelChanged) {
            userData.xp = xp;
            saveUserData();
            showNotification(`Novo nível alcançado! Nível ${userData.level}`, 'success');
            levelUpSound.play();
        }

        return levelChanged;
    }

    // Verificar streak
    function checkStreak() {
        const today = new Date().toISOString().split('T')[0];
        
        if (!userData.lastActiveDate) {
            userData.lastActiveDate = today;
            saveUserData();
            return;
        }

        const lastActive = userData.lastActiveDate;
        
        if (lastActive === today) return; // Já atualizou hoje
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastActive === yesterdayStr) {
            // Dia consecutivo
            userData.streak++;
            showNotification(`Sequência mantida! Agora são ${userData.streak} dias`, 'success');
        } else if (lastActive !== today) {
            // Quebrou a sequência
            if (userData.streak > 0) {
                showNotification(`Sequência quebrada após ${userData.streak} dias`, 'error');
            }
            userData.streak = 0;
        }
        
        // Registrar XP do dia anterior (se houver)
        if (userData.dailyXp > 0 && lastActive !== today) {
            if (!userData.history) userData.history = {};
            userData.history[lastActive] = userData.dailyXp;
            userData.dailyXp = 0;
        }
        
        userData.lastActiveDate = today;
        saveUserData();
    }

    // Salvar dados
    function saveUserData() {
        localStorage.setItem('lifeGamificationData', JSON.stringify(userData));
    }

    // Atualizar UI
    function updateUI() {
        // Atualizar XP, nível e streak
        currentXpElement.textContent = userData.xp;
        maxXpElement.textContent = getXpForLevel(userData.level);
        streakDaysElement.textContent = userData.streak;
        currentLevelElement.textContent = userData.level;
        
        // Atualizar barra de XP
        const xpPercentage = Math.min((userData.xp / getXpForLevel(userData.level)) * 100, 100);
        xpProgress.style.width = `${xpPercentage}%`;
        
        // Atualizar lista de tarefas
        tasksList.innerHTML = '';
        
        // Verificar se estamos na página de recompensas
        if (rewardsBtn.classList.contains('active')) {
            navigateToRewards();
            return;
        }
        
        // Verificar se estamos na página de nível
        if (levelBtn.classList.contains('active')) {
            navigateToLevel();
            return;
        }
        
        // Mostrar todas as tarefas na página principal
        userData.tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <span class="task-text">${task.name}</span>
                <span class="xp">+${task.xp}</span>
            `;
            
            taskElement.addEventListener('click', () => toggleTask(index));
            
            tasksList.appendChild(taskElement);
        });
    }

    // Alternar tarefa (completar/desfazer)
    function toggleTask(index) {
        const task = userData.tasks[index];
        
        if (task.completed) {
            // Desfazer tarefa
            task.completed = false;
            userData.xp -= task.xp;
            userData.dailyXp -= task.xp;
            if (userData.xp < 0) userData.xp = 0;
            if (userData.dailyXp < 0) userData.dailyXp = 0;
            
            showNotification(`Tarefa desfeita! -${task.xp}XP`, 'error');
        } else {
            // Completar tarefa
            task.completed = true;
            userData.xp += task.xp;
            userData.dailyXp += task.xp;
            
            showNotification(`Tarefa concluída! +${task.xp}XP`, 'success');
            completeSound.play();
        }
        
        checkLevel();
        saveUserData();
        updateUI();
    }

    // Mostrar notificação
    function showNotification(message, type = 'success') {
        const notificationContent = notification.querySelector('.notification-content');
        const notificationText = notification.querySelector('.notification-text');
        
        notification.className = `notification ${type}`;
        notificationText.textContent = message;
        
        // Configurar ícone baseado no tipo
        const iconClass = type === 'success' ? 'fa-check-circle' : 
                         type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
        notificationContent.innerHTML = `
            <i class="fas ${iconClass} notification-icon"></i>
            <span class="notification-text">${message}</span>
        `;
        
        // Remover classes de animação anteriores
        notification.classList.remove('show', 'hide');
        
        // Forçar reflow para reiniciar a animação
        void notification.offsetWidth;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.replace('show', 'hide');
        }, 3000);
    }

    // Navegar para recompensas
    function navigateToRewards() {
        // Criar elementos para exibir recompensas
        tasksList.innerHTML = '';
        
        const rewardsTitle = document.createElement('h2');
        rewardsTitle.textContent = '🎁 Recompensas';
        rewardsTitle.style.marginBottom = '15px';
        
        const rewardsContainer = document.createElement('div');
        rewardsContainer.className = 'list';
        
        userData.rewards.forEach((reward, index) => {
            const rewardElement = document.createElement('div');
            rewardElement.className = `reward ${reward.claimed ? 'claimed' : ''}`;
            rewardElement.innerHTML = `
                <span class="reward-text">${reward.name}</span>
                <span class="cost">-${reward.cost}</span>
            `;
            
            if (reward.claimed) {
                rewardElement.addEventListener('click', () => unclaimReward(index));
            } else if (userData.xp >= reward.cost) {
                rewardElement.addEventListener('click', () => claimReward(index));
            }
            
            rewardsContainer.appendChild(rewardElement);
        });
        
        tasksList.appendChild(rewardsTitle);
        tasksList.appendChild(rewardsContainer);
        
        // Ativar botão de recompensas
        homeBtn.classList.remove('active');
        rewardsBtn.classList.add('active');
        levelBtn.classList.remove('active');
    }

    // Navegar para nível
    function navigateToLevel() {
        tasksList.innerHTML = '';
        
        const levelTitle = document.createElement('h2');
        levelTitle.textContent = '📊 Progresso';
        levelTitle.style.marginBottom = '15px';
        
        const levelContainer = document.createElement('div');
        levelContainer.className = 'level-info';
        
        const xpNeeded = getXpForLevel(userData.level);
        const xpForNextLevel = xpNeeded - userData.xp;
        
        levelContainer.innerHTML = `
            <div class="level-stat">
                <span class="stat-label">Nível atual:</span>
                <span class="stat-value">${userData.level}</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">XP atual:</span>
                <span class="stat-value">${userData.xp}/${xpNeeded}</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">Faltam para próximo nível:</span>
                <span class="stat-value">${xpForNextLevel} XP</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">Sequência atual:</span>
                <span class="stat-value">${userData.streak} dias</span>
            </div>
        `;
        
        tasksList.appendChild(levelTitle);
        tasksList.appendChild(levelContainer);
        
        // Ativar botão de nível
        homeBtn.classList.remove('active');
        rewardsBtn.classList.remove('active');
        levelBtn.classList.add('active');
    }

    // Reivindicar recompensa
    function claimReward(index) {
        const reward = userData.rewards[index];
        if (reward.claimed || userData.xp < reward.cost) return;
        
        userData.xp -= reward.cost;
        reward.claimed = true;
        
        checkLevel();
        saveUserData();
        showNotification(`Recompensa reivindicada! -${reward.cost}XP`, 'success');
        rewardSound.play();
        
        navigateToRewards();
    }

    // Desfazer recompensa
    function unclaimReward(index) {
        const reward = userData.rewards[index];
        if (!reward.claimed) return;
        
        reward.claimed = false;
        userData.xp += reward.cost;
        
        checkLevel();
        saveUserData();
        showNotification(`Recompensa desfeita! +${reward.cost}XP`, 'success');
        
        navigateToRewards();
    }

    // Navegar para home
    function navigateToHome() {
        homeBtn.classList.add('active');
        rewardsBtn.classList.remove('active');
        levelBtn.classList.remove('active');
        updateUI();
    }

    // Mostrar histórico
    function showHistory() {
        historyList.innerHTML = '';
        
        if (!userData.history || Object.keys(userData.history).length === 0) {
            historyList.innerHTML = '<p class="no-history">Nenhum registro histórico encontrado.</p>';
            return;
        }
        
        // Ordenar datas (mais recente primeiro)
        const sortedDates = Object.keys(userData.history).sort((a, b) => new Date(b) - new Date(a));
        
        sortedDates.forEach(date => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span class="history-date">${formatDate(date)}</span>
                <span class="history-xp">${userData.history[date]} XP</span>
            `;
            historyList.appendChild(historyItem);
        });
        
        historyModal.style.display = 'block';
    }

    // Formatar data para exibição
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    }

    // Event listeners
    rewardsBtn.addEventListener('click', navigateToRewards);
    homeBtn.addEventListener('click', navigateToHome);
    levelBtn.addEventListener('click', navigateToLevel);
    historyBtn.addEventListener('click', showHistory);
    closeModal.addEventListener('click', () => {
        historyModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });

    // Inicializar
    loadUserData();
});