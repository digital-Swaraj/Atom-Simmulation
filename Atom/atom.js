var canvas = document.getElementById('atomCanvas');
var ctx = canvas.getContext('2d');

var nucleus = {
    protons: 1,
    neutrons: 0,
    electrons: 1
};

var data = {
    elems: ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti",
        "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru",
        "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy",
        "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra",
        "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds",
    "Rg", "Cn", "Hh", "Fl", "Ms", "Lv", "Ts", "Og"],
    protons: 1,
    electrons: 1,
    neutrons: 0,
    mass: 1,
    m:getMass(1, 1, 0),
    elem: "H",
    val: 1,
    ion: "-",
    charge: 0,
    radioacti: "No",
    init: function (p, n, e) {
        this.protons = p;
        this.neutrons = n;
        this.electrons = e;
        this.mass = p + n;
        this.m = getMass(p, e, n);
        this.elem = this.elems[p - 1];
        this.val = GetValency(this.electrons);
        this.charge = p - e;
        this.ion = (p === e ? "-" : (p > e ? "cation" : "anion"));
        this.radioacti = isStable(p, n)?"No":"Yes";
        this.setup();
    },
    span: function (i, z) {
        document.querySelectorAll("span")[i - 1].textContent = this[z];
    },
    setup: function () {
        this.span(1, "protons");
        this.span(2, "electrons");
        this.span(3, "neutrons");
        this.span(4, "elem");
        this.span(5, "protons");
        this.span(6, "mass");
        this.span(7, "m");
        this.span(9, "charge");
        this.span(11, "ion");
        this.span(12, "val");
        this.span(13, "radioacti");
    }
};

var dropdown = document.querySelectorAll("select")[0];

const neutronsL = [
    0, 2, 4, 5, 6, 6, 7, 8, 10, 10, 12, 12, 14, 14, 16, 16, 18, 22, 20, 20, 24, 26, 28, 28, 30, 30, 32, 35, 35, 38, 40, 42, 44, 46, 48, 50, 
    53, 55, 57, 59, 60, 62, 64, 66, 68, 70, 72, 74, 76, 77, 79, 81, 83, 84, 85, 87, 88, 89, 91, 93, 94, 96, 97, 99, 101, 103, 104, 105,106,
    108, 110, 111, 113, 115, 117, 118, 119, 121, 122, 123, 124, 126, 127, 128, 129, 130, 132, 133, 134, 136, 137, 138, 139, 140, 141, 143,
    144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171,172, 173, 175,
    176, 177, 178, 179, 180, 181, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,194, 195, 196, 197, 198, 199, 200, 201, 202, 203
];
const elementNames = ["Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon", "Sodium",
    "Magnesium", "Aluminum", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium", "Scandium", "Titanium",
    "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc", "Gallium", "Germanium", "Arsenic", "Selenium",
    "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium", "Zirconium", "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium",
    "Palladium", "Silver", "Cadmium", "Indium", "Tin", "Antimony", "Tellurium", "Iodine", "Xenon", "Cesium", "Barium", "Lanthanum", 
    "Cerium", "Praseodymium", "Neodymium", "Promethium", "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium",
    "Erbium", "Thulium", "Ytterbium", "Lutetium", "Hafnium", "Tantalum", "Tungsten", "Rhenium", "Osmium", "Iridium", "Platinum", "Gold",
    "Mercury", "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium", "Protactinium",
    "Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium", "Fermium", "Mendelevium",
    "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium", "Bohrium", "Hassium", "Meitnerium", "Darmstadtium", "Roentgenium",
"Copernicium", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"];

for(i=0; i<elementNames.length; i++){
    dropdown.innerHTML+="<option value="+(i+1)+">"+elementNames[i]+" - "+(i+neutronsL[i]+1)+"</option>";
}

dropdown.onchange = function(){
    var Z = parseInt(this.value);
    ElemX(Z, Z);
}
function span(i, z) {
    data.span(i, z);
}

var protonSize = 15;
var neutronSize = 15;
var electronSize = 10;
var nucleusRadius = 50;
var electronOrbitRadius = [90, 140, 200, 260, 320];
var shellLimits = [2, 8, 18, 32, 50, 72];

let electronAngles = [];
let electronShells = [];
let nucleusParticles = [];

function initElectrons() {
    electronAngles = [];
    electronShells = [0, 0, 0, 0, 0];
    let remainingElectrons = nucleus.electrons;
    
    for (let i = 0; i < shellLimits.length; i++) {
        if (remainingElectrons <= shellLimits[i]) {
            electronShells[i] = remainingElectrons;
            break;
            } else {
            electronShells[i] = shellLimits[i];
            remainingElectrons -= shellLimits[i];
        }
    }
    
    for (let i = 0; i < electronShells.length; i++) {
        let angleIncrement = (2 * Math.PI) / electronShells[i];
        for (let j = 0; j < electronShells[i]; j++) {
            electronAngles.push({ angle: j * angleIncrement, shell: i });
        }
    }
}

function drawAtom() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var nucleusX = canvas.width / 2;
    var nucleusY = canvas.height / 2;
    
    nucleusParticles.forEach(particle => {
        drawParticle(particle.x, particle.y, particle.size, particle.color);
    });
    
    var drawCloud = document.getElementById('electronCloud').checked;
    
    for (let i = 0; i < electronShells.length; i++) {
        if (electronShells[i] > 0) {
            if (drawCloud) {
                drawElectronCloud(nucleusX, nucleusY, electronOrbitRadius[i], electronShells[i]);
                } else {
                drawOrbital(nucleusX, nucleusY, electronOrbitRadius[i]);
                electronAngles.forEach(electron => {
                    if (electron.shell === i) {
                        let angle = electron.angle;
                        let electronX = nucleusX + electronOrbitRadius[i] * Math.cos(angle);
                        let electronY = nucleusY + electronOrbitRadius[i] * Math.sin(angle);
                        drawParticle(electronX, electronY, electronSize, 'blue');
                    }
                });
            }
        }
    }
}

function drawOrbital(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#636363';
    ctx.stroke();
}

function drawParticle(x, y, size, color) {
    let gradient = ctx.createRadialGradient(x, y, size * 0.1, x, y, size);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, color);
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = gradient;
    ctx.stroke();
}

function drawElectronCloud(x, y, radius, numElectrons) {
    var cloudRadius = radius + 20;
    var intensity = Math.min(numElectrons / 15, 0.4); 
    
    let gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, cloudRadius);
    gradient.addColorStop(0, `rgba(0, 0, 255, ${intensity})`); 
    gradient.addColorStop(0.6, `rgba(0, 0, 255, ${intensity * 0.5})`);
    gradient.addColorStop(1, `rgba(0, 0, 255, 0)`);
    
    ctx.beginPath();
    ctx.arc(x, y, cloudRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = gradient;
    ctx.stroke();
}

function addElectron() {
    nucleus.electrons += 1;
    data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
    initElectrons();
    drawAtom();
}

function removeElectron() {
    if (nucleus.electrons > 0) {
        nucleus.electrons -= 1;
        data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
        initElectrons();
        drawAtom();
    }
}

function addEnp() {
    addElectron();
    addProton();
}

function ElemX(Z, E, N) {
    nucleus.protons = Z;
    nucleus.electrons = E;
    nucleus.neutrons = N || neutronsL[Z-1]; 
    
    data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
    
    initElectrons();
    nucleusParticles = []; 
    
    let totalParticles = nucleus.protons + nucleus.neutrons;
    let protonCount = 0;
    let neutronCount = 0;
    
    for (let i = 0; i < totalParticles; i++) {
        let { x, y } = getRandomPositionInNucleus(i==0);
        if (protonCount < nucleus.protons && (i % 2 === 0 || neutronCount >= nucleus.neutrons)) {
            nucleusParticles.push({ x, y, size: protonSize, color: 'red' });
            protonCount++;
            } else {
            nucleusParticles.push({ x, y, size: neutronSize, color: 'darkgrey' });
            neutronCount++;
        }
    }
    drawAtom();
    dropdown.value=Z;
}

function getRandomPositionInNucleus(b) {
    b=b||false;
    if(b){
        return {x:canvas.width / 2, y:canvas.height / 2}
    }
    const scaledRadius = nucleusRadius * 0.6;
    const numParticles = nucleus.protons + nucleus.neutrons;
    const minDistance = 1.1 * protonSize; 
    
    let position;
    let attempts = 0;
    
    do {
        const theta = 2 * Math.PI * Math.random(); 
        const phi = Math.acos(2 * Math.random() - 1); 
        const r = Math.cbrt(Math.random()) * scaledRadius; 
        
        position = {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.sin(phi) * Math.sin(theta),
            z: r * Math.cos(phi)
        };
        
        position.x += canvas.width / 2;
        position.y += canvas.height / 2;
        
        var isValid = true;
        for (let i = 0; i < nucleusParticles.length; i++) {
            const dx = position.x - nucleusParticles[i].x;
            const dy = position.y - nucleusParticles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                isValid = false;
                break;
            }
        }
        
        attempts++;
    } while (!isValid && attempts < 100); 
    return position;
}

function addProton() {
    let position = getRandomPositionInNucleus();
    nucleusParticles.push({ x: position.x, y: position.y, size: protonSize, color: 'red' });
    nucleus.protons += 1;
    dropdown.value=nucleus.protons;
    data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
    drawAtom();
}

function removeProton() {
    if (nucleus.protons > 1) {
        let index = nucleusParticles.map(p => p.color).lastIndexOf('red');
        if (index !== -1) {
            nucleusParticles.splice(index, 1);
            nucleus.protons -= 1;
            dropdown.value=nucleus.protons;
            data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
            drawAtom();
        }
    }
}

function addNeutron() {
    let position = getRandomPositionInNucleus();
    nucleusParticles.push({ x: position.x, y: position.y, size: neutronSize, color: 'darkgrey' });
    nucleus.neutrons += 1;
    data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
    drawAtom();
}

function removeNeutron() {
    if (nucleus.neutrons > 0) {
        let index = nucleusParticles.map(p => p.color).lastIndexOf('darkgrey');
        if (index !== -1) {
            nucleusParticles.splice(index, 1);
            nucleus.neutrons -= 1;
            data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
            drawAtom();
        }
    }
}


function updateElectronPositions() {
    electronAngles.forEach(electron => {
        electron.angle += 0.02;
    });
}

function animate() {
    updateElectronPositions();
    drawAtom();
    
    requestAnimationFrame(animate);
}

function toggleElectronCloud() {
    drawAtom();
}

function GetValency(Z){
    var x = outerShellElectron(Z) % 8;
    return x <= 4 ? x : 8 - x;
}

function outerShellElectron(Z){
    if (Z <= 2) return Z;
    if (Z <= 10) return Z - 2;
    if (Z <= 28) return Z - 10; 
    if (Z <= 60) return Z - 28; 
    if (Z <= 110) return Z - 60; 
    return Z - 110; 
}

function getMass(Z, E, N){
    var eleMass = 0.00054*E, proMass = 1.0072*Z, neuMass = 1.008*N;
    return (eleMass+proMass+neuMass).toFixed(2);
}

function isStable(Z, N) {
    const N_to_Z = N / Z;
    const exceptions = {
        1: [1, 2], // Hydrogen isotopes: Protium (1H), Deuterium (2H)
        2: [3],    // Helium-3 (3He)
    };
    
    if (exceptions[Z] && exceptions[Z].includes(N)) {
        return true;
    }
    
    if (Z < 20) {
        return N_to_Z >= 0.95 && N_to_Z <= 1.05;
        } else {
        return N_to_Z >= 1 && N_to_Z <= 1.5;
    }
}

initElectrons();
nucleusParticles.push({ x: canvas.width / 2, y: canvas.height / 2, size: protonSize, color: 'red' });
drawAtom();
animate();
data.setup();
