var group = $("#group");

var fly1   = new Fly();
fly1.init(
    gf.addSprite(group,"fly1",{width: 69, height: 31, x: 280, y: 220}),
    280, 490,
    flyAnim
);
enemies.push(fly1);

var slime1 = new Slime();
slime1.init(
    gf.addSprite(group,"slime1",{width: 43, height: 28, x: 980, y: 392}),
    980, 1140,
    slimeAnim
);
enemies.push(slime1);

var slime2 = new Slime();
slime2.init(
    gf.addSprite(group,"slime2",{width: 43, height: 28, x: 2800, y: 392}),
    2800, 3000,
    slimeAnim
);
enemies.push(slime2);