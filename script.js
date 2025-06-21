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
    const slotSound = document.getElementById('slot-sound');
    const rewardsBtn = document.getElementById('rewards-btn');
    const homeBtn = document.getElementById('home-btn');
    const levelBtn = document.getElementById('level-btn');
    const historyBtn = document.getElementById('history-btn');
    const resetTasksBtn = document.getElementById('reset-tasks-btn');
    const historyModal = document.getElementById('history-modal');
    const historyList = document.getElementById('history-list');
    const rewardModal = document.getElementById('reward-modal');
    const rewardSlots = document.getElementById('reward-slots');
    const reward1Element = document.getElementById('reward-1');
    const reward2Element = document.getElementById('reward-2');
    const claimRewardsBtn = document.getElementById('claim-rewards-btn');
    const closeModal = document.querySelector('.close-modal');
    const closeRewardModal = document.querySelector('.close-reward-modal');
    const sectionTitle = document.getElementById('section-title');

    // Configurações
    const XP_LIMIT = 500;
    const REWARDS_PER_LEVEL = 2;

    // Dados do usuário
    let userData = {
        xp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: null,
        tasks: [],
        rewards: [],
        availableRewards: [],
        history: {},
        pendingRewards: []
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

    // Recompensas disponíveis
    const defaultAvailableRewards = [
        "Comer Nutella",
        "40 minutos de jogo",
        "Salgadinho",
        "RProgramar 1 hora",
        "Comer bastante",
        "Assistir 40min de YouTube",
        "Redes Sociais 30min permitidas",
        "15 minutos de redes sociais liberados",
        "1 episódio de anime",
        "Abrir o YouTube livremente por 15 minutos",
        "Jogar mobile por 15 minutos",
        "1 episódio de série",
        "Anular uma tarefa hoje",
        "Filme",
        "Programar 30 minhutos"
    ];

    // ========== FUNÇÕES PRINCIPAIS ========== //

    function loadUserData() {
        const savedData = localStorage.getItem('lifeGamificationData');
        if (savedData) {
            userData = JSON.parse(savedData);
            checkDailyReset();
        } else {
            resetTasks();
            userData.availableRewards = [...defaultAvailableRewards];
            saveUserData();
        }
        
        if (userData.pendingRewards.length > 0) {
            setTimeout(() => showRewardModal(userData.pendingRewards), 1000);
        }
        
        updateUI();
    }

    function saveUserData() {
        localStorage.setItem('lifeGamificationData', JSON.stringify(userData));
    }

    function resetTasks() {
        userData.tasks = JSON.parse(JSON.stringify(defaultTasks));
        saveUserData();
        updateUI();
        showNotification("Tarefas resetadas com sucesso!", "success");
    }

    function checkDailyReset() {
        const today = new Date().toISOString().split('T')[0];
        
        if (!userData.lastActiveDate) {
            userData.lastActiveDate = today;
            saveUserData();
            return;
        }

        if (userData.lastActiveDate === today) return;

        const yesterdayXp = calculateDailyXp();
        if (yesterdayXp > 0) {
            userData.history[userData.lastActiveDate] = yesterdayXp;
        }

        resetTasks();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (userData.lastActiveDate === yesterdayStr) {
            userData.streak++;
            showNotification(`🔥 Sequência mantida! ${userData.streak} dias`, 'success');
        } else if (userData.lastActiveDate !== today) {
            if (userData.streak > 0) {
                showNotification(`💤 Sequência quebrada após ${userData.streak} dias`, 'error');
            }
            userData.streak = 0;
        }
        
        userData.lastActiveDate = today;
        saveUserData();
    }

    function calculateDailyXp() {
        return userData.tasks.reduce((total, task) => {
            return task.completed ? total + task.xp : total;
        }, 0);
    }

    function checkLevelUp() {
        if (userData.xp >= XP_LIMIT) {
            userData.xp -= XP_LIMIT;
            userData.level++;
            
            const rewards = getRandomRewards(REWARDS_PER_LEVEL);
            userData.pendingRewards = rewards;
            
            showNotification(`🎉 Nível ${userData.level} alcançado! Ganhe suas recompensas!`, 'success');
            levelUpSound.play();
            
            showRewardModal(rewards);
            saveUserData();
            return true;
        }
        return false;
    }

    function getRandomRewards(count) {
        const available = [...userData.availableRewards];
        const rewards = [];
        
        for (let i = 0; i < count && available.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            rewards.push(available[randomIndex]);
            available.splice(randomIndex, 1);
        }
        
        return rewards;
    }

    function showRewardModal(rewards) {
        reward1Element.textContent = "";
        reward2Element.textContent = "";
        rewardSlots.querySelectorAll('.reward-icon').forEach(icon => {
            icon.classList.add('spinning');
            icon.textContent = "🎰";
        });
        
        rewardModal.style.display = "block";
        slotSound.play();
        
        setTimeout(() => {
            rewardSlots.querySelectorAll('.reward-icon').forEach(icon => {
                icon.classList.remove('spinning');
            });
            
            if (rewards[0]) {
                reward1Element.textContent = rewards[0];
                rewardSlots.querySelectorAll('.reward-icon')[0].textContent = "🎁";
            }
            
            if (rewards[1]) {
                reward2Element.textContent = rewards[1];
                rewardSlots.querySelectorAll('.reward-icon')[1].textContent = "🎁";
            }
        }, 2000);
    }

    function claimRewards() {
        userData.rewards.push(...userData.pendingRewards);
        userData.pendingRewards = [];
        rewardModal.style.display = "none";
        rewardSound.play();
        showNotification("Recompensas adicionadas ao seu inventário!", "success");
        saveUserData();
        
        if (rewardsBtn.classList.contains('active')) {
            navigateToRewards();
        }
    }

    function consumeReward(index) {
        const reward = userData.rewards[index];
        userData.rewards.splice(index, 1);
        saveUserData();
        showNotification(`Recompensa usada: ${reward}`, "success");
        navigateToRewards();
    }

    // ========== INTERFACE DO USUÁRIO ========== //

    function updateUI() {
        currentXpElement.textContent = userData.xp;
        maxXpElement.textContent = XP_LIMIT;
        streakDaysElement.textContent = userData.streak;
        currentLevelElement.textContent = userData.level;
        
        const xpPercentage = Math.min((userData.xp / XP_LIMIT) * 100, 100);
        xpProgress.style.width = `${xpPercentage}%`;
        
        tasksList.innerHTML = '';
        
        if (rewardsBtn.classList.contains('active')) {
            navigateToRewards();
        } else if (levelBtn.classList.contains('active')) {
            navigateToLevel();
        } else {
            navigateToHome();
        }
    }

    function showTasksList() {
        sectionTitle.textContent = "✅ Tarefas de Hoje";
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

    function showRewardsList() {
        sectionTitle.textContent = "🎁 Seu Inventário";
        const container = document.createElement('div');
        container.className = 'list';
        
        if (userData.rewards.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Nenhuma recompensa ainda. Complete tarefas para subir de nível e ganhar recompensas!';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '20px';
            emptyMsg.style.color = '#666';
            container.appendChild(emptyMsg);
        } else {
            userData.rewards.forEach((reward, index) => {
                const rewardElement = document.createElement('div');
                rewardElement.className = 'reward';
                rewardElement.innerHTML = `
                    <span class="reward-text">${reward}</span>
                    <span class="cost">Usar</span>
                `;
                rewardElement.addEventListener('click', () => consumeReward(index));
                container.appendChild(rewardElement);
            });
        }
        
        tasksList.appendChild(container);
    }

    function showLevelInfo() {
        sectionTitle.textContent = "📊 Progresso";
        const xpToNextLevel = XP_LIMIT - userData.xp;
        
        const container = document.createElement('div');
        container.className = 'level-info';
        
        container.innerHTML = `
            <div class="level-stat">
                <span class="stat-label">Nível atual:</span>
                <span class="stat-value">${userData.level}</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">XP atual:</span>
                <span class="stat-value">${userData.xp}/${XP_LIMIT}</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">Faltam para próximo nível:</span>
                <span class="stat-value">${xpToNextLevel} XP</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">Sequência atual:</span>
                <span class="stat-value">${userData.streak} dias</span>
            </div>
        `;
        
        tasksList.appendChild(container);
    }

    function showHistory() {
        historyList.innerHTML = '';
        
        if (!userData.history || Object.keys(userData.history).length === 0) {
            historyList.innerHTML = '<p class="no-history">Nenhum registro histórico encontrado.</p>';
            return;
        }
        
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

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    }

    function toggleTask(index) {
        const task = userData.tasks[index];
        
        if (task.completed) {
            task.completed = false;
            userData.xp -= task.xp;
            if (userData.xp < 0) userData.xp = 0;
            showNotification(`❌ Tarefa desfeita! -${task.xp} XP`, 'error');
        } else {
            task.completed = true;
            userData.xp += task.xp;
            showNotification(`✅ Tarefa concluída! +${task.xp} XP`, 'success');
            completeSound.play();
            checkLevelUp();
        }
        
        saveUserData();
        updateUI();
    }

    function showNotification(message, type = 'success') {
        const iconClass = type === 'success' ? 'fa-check-circle' :
                          type === 'error' ? 'fa-times-circle' : 'fa-info-circle';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass} notification-icon"></i>
                <span class="notification-text">${message}</span>
            </div>
        `;

        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.replace('show', 'hide');
        }, 3000);
    }

    // ========== NAVEGAÇÃO ========== //

    function navigateToHome() {
        homeBtn.classList.add('active');
        rewardsBtn.classList.remove('active');
        levelBtn.classList.remove('active');
        showTasksList();
    }

    function navigateToRewards() {
        homeBtn.classList.remove('active');
        rewardsBtn.classList.add('active');
        levelBtn.classList.remove('active');
        showRewardsList();
    }

    function navigateToLevel() {
        homeBtn.classList.remove('active');
        rewardsBtn.classList.remove('active');
        levelBtn.classList.add('active');
        showLevelInfo();
    }

    // ========== EVENT LISTENERS ========== //

    rewardsBtn.addEventListener('click', navigateToRewards);
    homeBtn.addEventListener('click', navigateToHome);
    levelBtn.addEventListener('click', navigateToLevel);
    historyBtn.addEventListener('click', showHistory);
    resetTasksBtn.addEventListener('click', resetTasks);
    claimRewardsBtn.addEventListener('click', claimRewards);
    
    closeModal.addEventListener('click', () => {
        historyModal.style.display = 'none';
    });
    
    closeRewardModal.addEventListener('click', () => {
        rewardModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.style.display = 'none';
        }
        if (e.target === rewardModal) {
            rewardModal.style.display = 'none';
        }
    });

    // Inicializar
    loadUserData();
});