document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const backBtn = document.getElementById('back-btn');
    const profileName = document.getElementById('profile-name');
    const profileLevel = document.getElementById('profile-level');
    const profileTitle = document.getElementById('profile-title');
    const avatar = document.getElementById('avatar');
    const eyes = document.getElementById('eyes');
    const hat = document.getElementById('hat');
    const profileBg = document.getElementById('profile-bg');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const skinItemsGrid = document.getElementById('skin-items');
    const hatsItemsGrid = document.getElementById('hats-items');
    const eyesItemsGrid = document.getElementById('eyes-items');
    const backgroundsItemsGrid = document.getElementById('backgrounds-items');
    const achievementsGrid = document.getElementById('achievements-grid');
    const profileHomeBtn = document.getElementById('profile-home-btn');
    const profileRewardsBtn = document.getElementById('profile-rewards-btn');
    const profileProfileBtn = document.getElementById('profile-profile-btn');
    const unlockAllBtn = document.getElementById('unlock-all-btn');
    const resetAllBtn = document.getElementById('reset-all-btn');

    // Dados do perfil
    let profileData = {
        name: "Gamificador",
        level: 1,
        currentSkin: "default",
        currentHat: "none",
        currentEyes: "black",
        currentBackground: "default",
        unlockedSkins: ["default"],
        unlockedHats: ["none"],
        unlockedEyes: ["black"],
        unlockedBackgrounds: ["default"],
        achievements: []
    };

    // Banco de conquistas
    const achievementsDB = {
        skins: [
            { id: "default", name: "Pele Básica", level: 1, color: "#f5d0b9" },
            { id: "light", name: "Pele Clara", level: 1, color: "#e8c1a0" },
            { id: "tan", name: "Pele Bronzeada", level: 1, color: "#d2a679" },
            { id: "medium", name: "Pele Média", level: 5, color: "#b88b61" },
            { id: "olive", name: "Pele Oliva", level: 5, color: "#b5a27a" },
            { id: "dark", name: "Pele Escura", level: 10, color: "#8d5524" },
            { id: "deep", name: "Pele Profunda", level: 15, color: "#5a3825" },
            { id: "pale", name: "Pele Pálida", level: 1, color: "#ffe0bd" },
            { id: "green", name: "Pele Verde", level: 20, color: "#a8d8a8" },
            { id: "blue", name: "Pele Azul", level: 25, color: "#a8c8d8" },
            { id: "red", name: "Pele Vermelha", level: 30, color: "#d8a8a8" },
            { id: "purple", name: "Pele Roxa", level: 35, color: "#c8a8d8" },
            { id: "gold", name: "Pele Dourada", level: 50, color: "#ffd700" },
            { id: "silver", name: "Pele Prateada", level: 75, color: "#c0c0c0" },
            { id: "rainbow", name: "Pele Arco-íris", level: 100, color: "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)" },
            { id: "galaxy", name: "Pele Galáxia", level: 150, color: "linear-gradient(45deg, #000428, #004e92, #000428)" },
            { id: "marble", name: "Pele Mármore", level: 200, color: "linear-gradient(45deg, #e0e0e0, #c0c0c0, #e0e0e0)" },
            { id: "diamond", name: "Pele Diamante", level: 250, color: "linear-gradient(45deg, #b9f2ff, #ffffff, #b9f2ff)" }
        ],
        hats: [
            { 
                id: "none", 
                name: "Sem Chapéu", 
                level: 1, 
                style: "display: none;" 
            },
            { 
                id: "baseball", 
                name: "Boné de Baseball", 
                level: 5, 
                style: "width: 80%; height: 15px; background: #5e72e4; border-radius: 15px 15px 0 0; border-bottom: 5px solid #4a5bd6; &::after { content: ''; position: absolute; top: 15px; left: 50%; transform: translateX(-50%); width: 60%; height: 10px; background: #5e72e4; border-radius: 0 0 10px 10px; }" 
            },
            { 
                id: "tophat", 
                name: "Cartola", 
                level: 10, 
                style: "width: 60%; height: 25px; background: #2d3748; border-radius: 5px 5px 0 0; &::before { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 80%; height: 10px; background: #2d3748; border-radius: 0 0 5px 5px; }" 
            },
            { 
                id: "cowboy", 
                name: "Chapéu de Cowboy", 
                level: 15, 
                style: "width: 100%; height: 10px; background: #a0522d; border-radius: 50%; &::before { content: ''; position: absolute; top: 5px; left: 50%; transform: translateX(-50%); width: 120%; height: 15px; background: #a0522d; border-radius: 50%; }" 
            },
            { 
                id: "beanie", 
                name: "Gorro de Inverno", 
                level: 20, 
                style: "width: 80%; height: 30px; background: #f56565; border-radius: 50% 50% 0 0; clip-path: ellipse(50% 60% at 50% 40%); &::after { content: ''; position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 60%; height: 15px; background: #f56565; border-radius: 0 0 10px 10px; }" 
            },
            { 
                id: "crown", 
                name: "Coroa Real", 
                level: 30, 
                style: "width: 70%; height: 20px; background: gold; clip-path: polygon(0% 0%, 10% 60%, 30% 100%, 50% 80%, 70% 100%, 90% 60%, 100% 0%); box-shadow: 0 0 10px gold;" 
            },
            { 
                id: "wizard", 
                name: "Chapéu de Mago", 
                level: 50, 
                style: "width: 60%; height: 40px; background: #9f7aea; clip-path: polygon(0% 0%, 100% 0%, 50% 100%); &::before { content: ''; position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 80%; height: 10px; background: #9f7aea; border-radius: 5px; }" 
            },
            { 
                id: "halo", 
                name: "Auréola", 
                level: 100, 
                style: "width: 80%; height: 5px; background: gold; border-radius: 50%; box-shadow: 0 0 15px gold;" 
            },
            { 
                id: "pirate", 
                name: "Chapéu de Pirata", 
                level: 25, 
                style: "width: 80%; height: 15px; background: #2d3748; border-radius: 10px 10px 0 0; &::before { content: ''; position: absolute; top: 15px; left: 30%; width: 40%; height: 20px; background: #2d3748; clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%); }" 
            },
            { 
                id: "chef", 
                name: "Chapéu de Chef", 
                level: 35, 
                style: "width: 80%; height: 25px; background: white; border-radius: 5px; &::before { content: ''; position: absolute; top: 25px; left: 50%; transform: translateX(-50%); width: 60%; height: 15px; background: white; border-radius: 0 0 10px 10px; }" 
            },
            { 
                id: "viking", 
                name: "Chapéu Viking", 
                level: 40, 
                style: "width: 80%; height: 20px; background: #a0522d; border-radius: 10px; &::before { content: ''; position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 100%; height: 15px; background: #a0522d; clip-path: polygon(0% 0%, 25% 100%, 75% 100%, 100% 0%); }" 
            },
            { 
                id: "santa", 
                name: "Chapéu de Natal", 
                level: 45, 
                style: "width: 70%; height: 30px; background: #f56565; clip-path: polygon(0% 0%, 100% 0%, 50% 100%); &::before { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 100%; height: 15px; background: white; border-radius: 5px; }" 
            },
            { 
                id: "grad", 
                name: "Chapéu de Formatura", 
                level: 60, 
                style: "width: 80%; height: 10px; background: #2d3748; border-radius: 5px; &::before { content: ''; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 100%; height: 5px; background: #5e72e4; }" 
            },
            { 
                id: "witch", 
                name: "Chapéu de Bruxa", 
                level: 75, 
                style: "width: 60%; height: 50px; background: #2d3748; clip-path: polygon(0% 0%, 100% 0%, 50% 100%); border-radius: 5px 5px 0 0;" 
            },
            { 
                id: "afro", 
                name: "Afro", 
                level: 20, 
                style: "width: 100%; height: 40px; background: #000; border-radius: 50%; box-shadow: 0 0 0 5px #333;" 
            }
        ],
        eyes: [
            { id: "black", name: "Olhos Pretos", level: 1, color: "#000000" },
            { id: "blue", name: "Olhos Azuis", level: 5, color: "#5e72e4" },
            { id: "green", name: "Olhos Verdes", level: 10, color: "#48bb78" },
            { id: "brown", name: "Olhos Castanhos", level: 1, color: "#8d5524" },
            { id: "hazel", name: "Olhos Avelã", level: 5, color: "#b5a642" },
            { id: "gray", name: "Olhos Cinza", level: 10, color: "#a8a8a8" },
            { id: "amber", name: "Olhos Âmbar", level: 15, color: "#ffbf00" },
            { id: "red", name: "Olhos Vermelhos", level: 20, color: "#f56565" },
            { id: "gold", name: "Olhos Dourados", level: 25, color: "#ffd700" },
            { id: "silver", name: "Olhos Prateados", level: 30, color: "#c0c0c0" },
            { id: "glow", name: "Olhos Brilhantes", level: 35, color: "#ffffff", style: "box-shadow: 0 0 10px #ffffff;" },
            { id: "rainbow", name: "Olhos Arco-íris", level: 50, color: "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)" },
            { id: "hearts", name: "Olhos de Coração", level: 75, color: "#ff6b6b", style: "clip-path: circle(50% at 50% 50%);" },
            { id: "stars", name: "Olhos de Estrela", level: 100, color: "#ffd700", style: "clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);" },
            { id: "cat", name: "Olhos de Gato", level: 40, color: "#5e72e4", style: "clip-path: ellipse(25% 40% at 50% 50%);" },
            { id: "snake", name: "Olhos de Serpente", level: 60, color: "#48bb78", style: "clip-path: ellipse(15% 50% at 50% 50%);" },
            { id: "robot", name: "Olhos de Robô", level: 80, color: "#a8a8a8", style: "border-radius: 0; box-shadow: 0 0 0 2px #333;" },
            { id: "alien", name: "Olhos Alienígenas", level: 120, color: "#48bb78", style: "clip-path: ellipse(40% 20% at 50% 50%);" }
        ],
        backgrounds: [
            { id: "default", name: "Padrão", level: 1, style: "background-color: #f8f9fa;" },
            { id: "nature", name: "Natureza", level: 5, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "beach", name: "Praia", level: 10, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "forest", name: "Floresta", level: 15, image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "space", name: "Espaço", level: 20, image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "city", name: "Cidade", level: 25, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "mountain", name: "Montanhas", level: 30, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "desert", name: "Deserto", level: 35, image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "waterfall", name: "Cachoeira", level: 40, image: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "castle", name: "Castelo", level: 45, image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "underwater", name: "Subaquático", level: 50, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "galaxy", name: "Galáxia", level: 60, image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "golden", name: "Dourado", level: 70, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "neon", name: "Neon", level: 80, image: "https://images.unsplash.com/photo-1517994112540-009c47ea476b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "abstract", name: "Abstrato", level: 90, image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "fantasy", name: "Fantasia", level: 100, image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "cyberpunk", name: "Cyberpunk", level: 120, image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
            { id: "medieval", name: "Medieval", level: 150, image: "https://images.unsplash.com/photo-1513628253939-010e64ac66cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }
        ],
        titles: [
            { id: "novice", name: "Novato", level: 1 },
            { id: "apprentice", name: "Aprendiz", level: 10 },
            { id: "warrior", name: "Guerreiro", level: 20 },
            { id: "expert", name: "Experiente", level: 30 },
            { id: "master", name: "Mestre", level: 50 },
            { id: "grandmaster", name: "Grão-Mestre", level: 75 },
            { id: "legend", name: "Lendário", level: 100 },
            { id: "mythic", name: "Mítico", level: 150 },
            { id: "divine", name: "Divino", level: 200 },
            { id: "immortal", name: "Imortal", level: 300 },
            { id: "supreme", name: "Supremo", level: 500 },
            { id: "transcendent", name: "Transcendente", level: 750 },
            { id: "omnipotent", name: "Onipotente", level: 1001 }
        ]
    };

    // Carregar dados do perfil
    function loadProfileData() {
        const savedData = localStorage.getItem('lifeGamificationProfile');
        if (savedData) {
            profileData = JSON.parse(savedData);
        }
        
        // Verificar e desbloquear itens conforme o nível
        checkUnlockedItems();
        updateProfileUI();
    }

    // Salvar dados do perfil
    function saveProfileData() {
        localStorage.setItem('lifeGamificationProfile', JSON.stringify(profileData));
    }

    // Verificar itens desbloqueados
    function checkUnlockedItems() {
        // Verificar skins desbloqueadas
        achievementsDB.skins.forEach(skin => {
            if (profileData.level >= skin.level && !profileData.unlockedSkins.includes(skin.id)) {
                profileData.unlockedSkins.push(skin.id);
                showAchievementNotification(`Nova pele desbloqueada: ${skin.name}`);
            }
        });

        // Verificar chapéus desbloqueados
        achievementsDB.hats.forEach(hat => {
            if (profileData.level >= hat.level && !profileData.unlockedHats.includes(hat.id)) {
                profileData.unlockedHats.push(hat.id);
                showAchievementNotification(`Novo chapéu desbloqueado: ${hat.name}`);
            }
        });

        // Verificar olhos desbloqueados
        achievementsDB.eyes.forEach(eye => {
            if (profileData.level >= eye.level && !profileData.unlockedEyes.includes(eye.id)) {
                profileData.unlockedEyes.push(eye.id);
                showAchievementNotification(`Novo estilo de olhos desbloqueado: ${eye.name}`);
            }
        });

        // Verificar fundos desbloqueados
        achievementsDB.backgrounds.forEach(bg => {
            if (profileData.level >= bg.level && !profileData.unlockedBackgrounds.includes(bg.id)) {
                profileData.unlockedBackgrounds.push(bg.id);
                showAchievementNotification(`Novo cenário desbloqueado: ${bg.name}`);
            }
        });

        // Verificar títulos desbloqueados
        achievementsDB.titles.forEach(title => {
            if (profileData.level >= title.level && !profileData.achievements.includes(title.id)) {
                profileData.achievements.push(title.id);
                showAchievementNotification(`Novo título desbloqueado: ${title.name}`);
                profileData.name = title.name; // Atualiza o nome para o título
            }
        });

        saveProfileData();
    }

    // Atualizar UI do perfil
    function updateProfileUI() {
        profileLevel.textContent = profileData.level;
        profileTitle.textContent = getCurrentTitle();
        profileName.textContent = profileData.name;
        
        // Aplicar skin atual
        const currentSkin = achievementsDB.skins.find(s => s.id === profileData.currentSkin);
        if (currentSkin) {
            document.querySelector('.face').style.background = currentSkin.color || currentSkin.style || "#f5d0b9";
        }
        
        // Aplicar chapéu atual
        const currentHat = achievementsDB.hats.find(h => h.id === profileData.currentHat);
        if (currentHat) {
            hat.style.cssText = currentHat.style || "none";
        } else {
            hat.style.cssText = "none";
        }
        
        // Aplicar olhos atuais
        const currentEyes = achievementsDB.eyes.find(e => e.id === profileData.currentEyes);
        if (currentEyes) {
            document.querySelectorAll('.eye').forEach(eye => {
                eye.style.background = currentEyes.color || "#000000";
                if (currentEyes.style) {
                    eye.style.cssText += currentEyes.style;
                }
            });
        }
        
        // Aplicar fundo atual
        const currentBg = achievementsDB.backgrounds.find(b => b.id === profileData.currentBackground);
        if (currentBg) {
            if (currentBg.image) {
                profileBg.style.backgroundImage = `url(${currentBg.image})`;
                profileBg.style.backgroundColor = "transparent";
            } else {
                profileBg.style.backgroundImage = "none";
                profileBg.style.backgroundColor = currentBg.style || "#f8f9fa";
            }
        }
        
        // Atualizar grids de personalização
        updateCustomizationGrids();
        updateAchievementsGrid();
    }

    // Obter título atual
    function getCurrentTitle() {
        const unlockedTitles = achievementsDB.titles.filter(t => 
            profileData.achievements.includes(t.id)
        ).sort((a, b) => b.level - a.level);
        
        return unlockedTitles.length > 0 ? unlockedTitles[0].name : "Novato";
    }

    // Atualizar grids de personalização
    function updateCustomizationGrids() {
        // Skins
        skinItemsGrid.innerHTML = '';
        achievementsDB.skins.forEach(skin => {
            const isUnlocked = profileData.unlockedSkins.includes(skin.id);
            const isSelected = profileData.currentSkin === skin.id;
            
            const skinItem = document.createElement('div');
            skinItem.className = `custom-item ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`;
            skinItem.dataset.id = skin.id;
            skinItem.dataset.type = "skin";
            
            skinItem.innerHTML = `
                <div class="item-preview" style="background: ${skin.color || skin.style || '#f5d0b9'}"></div>
                <div class="item-name">${skin.name}</div>
                ${!isUnlocked ? `<div class="item-level">Nível ${skin.level}</div>` : ''}
            `;
            
            if (isUnlocked) {
                skinItem.addEventListener('click', () => selectCustomItem("skin", skin.id));
            }
            
            skinItemsGrid.appendChild(skinItem);
        });
        
        // Hats
        hatsItemsGrid.innerHTML = '';
        achievementsDB.hats.forEach(hat => {
            const isUnlocked = profileData.unlockedHats.includes(hat.id);
            const isSelected = profileData.currentHat === hat.id;
            
            const hatItem = document.createElement('div');
            hatItem.className = `custom-item ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`;
            hatItem.dataset.id = hat.id;
            hatItem.dataset.type = "hat";
            
            // Criar um elemento para visualização do chapéu
            const hatPreview = document.createElement('div');
            hatPreview.className = 'hat-preview';
            hatPreview.style.cssText = hat.style.replace(/&::before/g, '').replace(/&::after/g, '');
            
            hatItem.innerHTML = `
                <div class="hat-preview" style="${hat.style.replace(/&::before/g, '').replace(/&::after/g, '')}"></div>
                <div class="item-name">${hat.name}</div>
                ${!isUnlocked ? `<div class="item-level">Nível ${hat.level}</div>` : ''}
            `;
            
            if (isUnlocked) {
                hatItem.addEventListener('click', () => selectCustomItem("hat", hat.id));
            }
            
            hatsItemsGrid.appendChild(hatItem);
        });
        
        // Eyes
        eyesItemsGrid.innerHTML = '';
        achievementsDB.eyes.forEach(eye => {
            const isUnlocked = profileData.unlockedEyes.includes(eye.id);
            const isSelected = profileData.currentEyes === eye.id;
            
            const eyeItem = document.createElement('div');
            eyeItem.className = `custom-item ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`;
            eyeItem.dataset.id = eye.id;
            eyeItem.dataset.type = "eye";
            
            eyeItem.innerHTML = `
                <div class="eye-preview" style="background-color: ${eye.color || '#000000'}; ${eye.style || ''}"></div>
                <div class="item-name">${eye.name}</div>
                ${!isUnlocked ? `<div class="item-level">Nível ${eye.level}</div>` : ''}
            `;
            
            if (isUnlocked) {
                eyeItem.addEventListener('click', () => selectCustomItem("eye", eye.id));
            }
            
            eyesItemsGrid.appendChild(eyeItem);
        });
        
        // Backgrounds
        backgroundsItemsGrid.innerHTML = '';
        achievementsDB.backgrounds.forEach(bg => {
            const isUnlocked = profileData.unlockedBackgrounds.includes(bg.id);
            const isSelected = profileData.currentBackground === bg.id;
            
            const bgItem = document.createElement('div');
            bgItem.className = `custom-item ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`;
            bgItem.dataset.id = bg.id;
            bgItem.dataset.type = "background";
            
            const bgStyle = bg.image ? `background-image: url(${bg.image})` : `background: ${bg.style || '#f8f9fa'}`;
            
            bgItem.innerHTML = `
                <div class="background-preview" style="${bgStyle}"></div>
                <div class="item-name">${bg.name}</div>
                ${!isUnlocked ? `<div class="item-level">Nível ${bg.level}</div>` : ''}
            `;
            
            if (isUnlocked) {
                bgItem.addEventListener('click', () => selectCustomItem("background", bg.id));
            }
            
            backgroundsItemsGrid.appendChild(bgItem);
        });
    }

    // Atualizar grid de conquistas
    function updateAchievementsGrid() {
        achievementsGrid.innerHTML = '';
        
        // Títulos
        achievementsDB.titles.forEach(title => {
            const isUnlocked = profileData.achievements.includes(title.id);
            
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${isUnlocked ? '' : 'locked'}`;
            
            achievementItem.innerHTML = `
                <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
                <div class="achievement-name">${title.name}</div>
                <div class="achievement-level">Nível ${title.level}</div>
            `;
            
            achievementsGrid.appendChild(achievementItem);
        });
    }

    // Selecionar item de personalização
    function selectCustomItem(type, id) {
        switch(type) {
            case "skin":
                profileData.currentSkin = id;
                break;
            case "hat":
                profileData.currentHat = id;
                break;
            case "eye":
                profileData.currentEyes = id;
                break;
            case "background":
                profileData.currentBackground = id;
                break;
        }
        
        saveProfileData();
        updateProfileUI();
    }

    // Mostrar notificação de conquista
    function showAchievementNotification(message, type = 'success') {
        const iconClass = type === 'success' ? 'fa-trophy' :
                      type === 'error' ? 'fa-times-circle' : 'fa-info-circle';

        const notification = document.createElement('div');
        notification.className = `achievement-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass} notification-icon"></i>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Desbloquear todos os itens
    function unlockAllItems() {
        if (!confirm("Tem certeza que deseja desbloquear TODOS os itens e conquistas? Isso não pode ser desfeito.")) {
            return;
        }
        
        // Desbloquear todas as skins
        profileData.unlockedSkins = achievementsDB.skins.map(skin => skin.id);
        profileData.currentSkin = "diamond";
        
        // Desbloquear todos os chapéus
        profileData.unlockedHats = achievementsDB.hats.map(hat => hat.id);
        profileData.currentHat = "halo";
        
        // Desbloquear todos os olhos
        profileData.unlockedEyes = achievementsDB.eyes.map(eye => eye.id);
        profileData.currentEyes = "alien";
        
        // Desbloquear todos os fundos
        profileData.unlockedBackgrounds = achievementsDB.backgrounds.map(bg => bg.id);
        profileData.currentBackground = "cyberpunk";
        
        // Desbloquear todos os títulos
        profileData.achievements = achievementsDB.titles.map(title => title.id);
        profileData.name = achievementsDB.titles[achievementsDB.titles.length - 1].name;
        
        // Definir nível máximo para visualização
        profileData.level = 1001;
        
        saveProfileData();
        updateProfileUI();
        showAchievementNotification("Tudo foi desbloqueado! Divirta-se!", "success");
    }

    // Resetar todas as conquistas
    function resetAllItems() {
        if (!confirm("Tem certeza que deseja resetar TODAS as conquistas e personalizações? Você voltará ao estado inicial.")) {
            return;
        }
        
        // Resetar para valores padrão
        profileData.unlockedSkins = ["default"];
        profileData.currentSkin = "default";
        
        profileData.unlockedHats = ["none"];
        profileData.currentHat = "none";
        
        profileData.unlockedEyes = ["black"];
        profileData.currentEyes = "black";
        
        profileData.unlockedBackgrounds = ["default"];
        profileData.currentBackground = "default";
        
        profileData.achievements = ["novice"];
        profileData.name = "Gamificador";
        
        // Nota: Não resetamos o nível aqui para manter a sincronia com o jogo principal
        
        saveProfileData();
        updateProfileUI();
        showAchievementNotification("Todas as conquistas foram resetadas!", "success");
    }

    // Alternar entre abas
    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    }

    // Event Listeners
    backBtn.addEventListener('click', () => {
        window.location.href = "index.html";
    });
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
    
    profileHomeBtn.addEventListener('click', () => {
        window.location.href = "index.html";
    });

    profileRewardsBtn.addEventListener('click', () => {
        window.location.href = "index.html#rewards";
    });

    profileProfileBtn.addEventListener('click', () => {
        // Já está na página de perfil
    });

    unlockAllBtn.addEventListener('click', unlockAllItems);
    resetAllBtn.addEventListener('click', resetAllItems);

    // Inicializar
    loadProfileData();
});