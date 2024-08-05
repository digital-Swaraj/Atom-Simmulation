var canvas = document.getElementById('atomCanvas');
var ctx = canvas.getContext('2d');

var nucleus = {
    protons: 1,
    neutrons: 0,
    electrons: 1
};

var data = {
    elems: ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt"],
    protons: 1,
    electrons: 1,
    neutrons: 0,
    mass: 1,
    elem: "H",
    val: 1,
    ion: "-",
    charge: 0,
    radioacti: "No",
    init: function (p, n, e) {
        data.protons = p;
        data.neutrons = n;
        data.electrons = e;
        data.mass = p + n;
        data.elem = data.elems[p - 1];
        data.val = GetValency(data.electrons);
        data.charge = p - e;
        data.ion = (p == e ? "-" : (p > e ? "cation" : "anion"));
        data.radioacti = (p - n > 5 ? "Yes" : (p == 90 || p == 92 || p == 101 ? "Yes" : "No"));
        data.setup();
    },
    span: function (i, z) {
        $("span").eq(i - 1).text(data[z]);
    },
    setup: function () {
        span(1, "protons");
        span(2, "electrons");
        span(3, "neutrons");
        span(4, "elem");
        span(5, "protons");
        span(6, "mass");
        span(7, "mass");
        span(9, "charge");
        span(11, "ion");
        span(12, "val");
        span(13, "radioacti");
    }
};

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
        if (remainingElectrons > shellLimits[i]) {
            electronShells[i] = shellLimits[i];
            remainingElectrons -= shellLimits[i];
        } else {
            electronShells[i] = remainingElectrons;
            remainingElectrons = 0;
        }
    }

    for (let i = 0; i < electronShells.length; i++) {
        var angleIncrement = (2 * Math.PI) / electronShells[i];
        for (let j = 0; j < electronShells[i]; j++) {
            electronAngles.push({ angle: j * angleIncrement, shell: i });
        }
    }
}

function drawAtom() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var nucleusX = canvas.width / 2;
    var nucleusY = canvas.height / 2;

    for (var particle of nucleusParticles) {
        drawParticle(particle.x, particle.y, particle.size, particle.color);
    }

    var drawCloud = document.getElementById('electronCloud').checked;

    for (let i = 0; i < electronShells.length; i++) {
        if (electronShells[i] > 0) {
            if (drawCloud) {
                drawElectronCloud(nucleusX, nucleusY, electronOrbitRadius[i], electronShells[i], i);
            } else {
                drawOrbital(nucleusX, nucleusY, electronOrbitRadius[i]);
                for (let j = 0; j < electronAngles.length; j++) {
                    if (electronAngles[j].shell === i) {
                        var angle = electronAngles[j].angle;
                        var electronX = nucleusX + electronOrbitRadius[i] * Math.cos(angle);
                        var electronY = nucleusY + electronOrbitRadius[i] * Math.sin(angle);
                        drawParticle(electronX, electronY, electronSize, 'blue');
                    }
                }
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
    var gradient = ctx.createRadialGradient(x, y, size * 0.1, x, y, size);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, color);

    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = gradient;
    ctx.stroke();
}

function drawElectronCloud(x, y, radius, numElectrons, shellIndex) {
    var cloudRadius = radius + 20;
    var intensity = Math.min(numElectrons / 15, 0.4); 

    var gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, cloudRadius);
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

function addProton() {
    var { x, y } = getRandomPositionInNucleus();
    nucleusParticles.push({ x, y, size: protonSize, color: 'red' });
    nucleus.protons += 1;
    data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
    drawAtom();
}

function removeProton() {
    if (nucleus.protons > 0) {
        var index = nucleusParticles.findIndex(p => p.color === 'red');
        if (index !== -1) {
            nucleusParticles.splice(index, 1);
            nucleus.protons -= 1;
            data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
            drawAtom();
        }
    }
}

function addNeutron() {
    var { x, y } = getRandomPositionInNucleus();
    nucleusParticles.push({ x, y, size: neutronSize, color: 'darkgrey' });
    nucleus.neutrons += 1;
    data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
    drawAtom();
}

function removeNeutron() {
    if (nucleus.neutrons > 0) {
        var index = nucleusParticles.findIndex(p => p.color === 'darkgrey');
        if (index !== -1) {
            nucleusParticles.splice(index, 1);
            nucleus.neutrons -= 1;
            data.init(nucleus.protons, nucleus.neutrons, nucleus.electrons);
            drawAtom();
        }
    }
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

function andEnnp() {
    addEnp();
    addNeutron();
}

function getRandomPositionInNucleus() {
    var nucleusX = canvas.width / 2;
    var nucleusY = canvas.height / 2;
    let angle = Math.random() * 2 * Math.PI;
    let radius = Math.random() * (nucleusRadius - protonSize);

    return {
        x: nucleusX + radius * Math.cos(angle),
        y: nucleusY + radius * Math.sin(angle)
    };
}

function updateElectronPositions() {
    for (let i = 0; i < electronAngles.length; i++) {
        electronAngles[i].angle += 0.02;
    }
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
    if(x<=4){
        return x;
    }
    else {
        return 8-x;
    }
}

function outerShellElectron(Z){
    if(Z<=2){
        return Z;
    }
    if(Z<=10){
        return Z-2;
    }
    if(Z<=28){
        return Z-10; 
    }
    if(Z<=60){
        return Z-28; 
    }
    if(Z<=110){
        return Z-60; 
    }
    if(Z<=182){
        return Z-110; 
    }
}

initElectrons();
nucleusParticles.push({ x: canvas.width / 2, y: canvas.height / 2, size: protonSize, color: 'red' });
drawAtom();
animate();
data.setup();
