/****************************************************
*                                                   * 
*                                                   *
*       GAME RACE                                   *
*                                                   *
*                                                   *
****************************************************/


let Engine          = Matter.Engine,
    Render          = Matter.Render,
    Runner          = Matter.Runner,
    World           = Matter.World,
    Body            = Matter.Body,
    Bodies          = Matter.Bodies,
    Events          = Matter.Events,
    Constraint      = Matter.Constraint,
    Composite       = Matter.Composite,
    Composites      = Matter.Composites,
    Bounds          = Matter.Bounds,
    Query           = Matter.Query;

let spawnx = 300;
let spawny = 150;
let width = 1000;
let height = 600;
let globalWidth = 31000;
let globalHeight = 3600;
let bumpiness = 22;
let counter = 0;
let infCounter = -1000; 
let state = false; 
    
let engine = Engine.create(),
  world = engine.world;

let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    showAngleIndicator : false,
    wireframes         : false,
    showVelocity       : false,
    showCollisions     : false,
    enableSleeping     : true,
    hasBounds          : true,          
  }
});

let runner = Runner.create();
    Runner.run(runner, engine);

Engine.run(engine);
Render.run(render);     

let rights = physicsSprite();
let ground = generateGround();    

function generateGround() {
  let terrainWidth = globalWidth - 400;
  let rectHeight = 20;
  let rectLength = 1283;
  let segments = terrainWidth / rectLength;
  let startingPlatformLength = 2;
  let degreeChange = bumpiness;
  let radians = degreeChange * (Math.PI/180);
  let rectangles = [];
  let initialx = 0;
  let initialy = height / 2;
  let initialAngle = 0; 
  let posx = initialx;
  let posy = initialy;
  let angle = initialAngle;
  
  for(let i = 0; i < segments; i++){
    var randomTilt = (Math.random()*(radians*2)) - radians;
    var prevAngle = angle;
    if(i > startingPlatformLength){
      angle = initialAngle + randomTilt;      
    }
    
    let ground = Bodies.rectangle(posx,posy,rectLength,rectHeight, {isStatic: true,
      render: {              
        sprite: {
          texture: 'img/ground.png',
          xScale: 1,
          yScale: 1,        
        }                
      }
    });

    let fon = Bodies.rectangle(posx,posy,rectLength,rectHeight, {isStatic: true, 
      render: {                 
        sprite: {
          texture: 'img/fon.jpg',         
          xScale: 1,
          yScale: 1,        
        }    
      }
    }); 

    
    Body.setAngle(ground,angle);
    if(rectangles.length > 0) {
      let rect1LeftCorner = ground.vertices[0];
      let rect2RightCorner = rectangles[rectangles.length-1].vertices[1];
      let r1x = rect1LeftCorner.x;
      let r2x = rect2RightCorner.x;
      let r1y = rect1LeftCorner.y;
      let r2y = rect2RightCorner.y;
      let offset = {x: r2x - r1x, y: r2y - r1y };
      Body.translate(ground,offset);      
    }
    posx += rectLength;
    rectangles.push(ground);
    //World.add(engine.world,[fon]);
  }   
  return Body.create({parts: rectangles,isStatic: true}); 
}

function physicsSprite() {
  let right = Bodies.circle(354,113,Math.ceil(50), {
    density: 0.0005,
    friction: 0.8,
    frictionStatic: 0.8,
    frictionAir: 0.0001,
    //frictionAir: 0.001,
    restitution: 0.10,
    portal: -1,
    mass: 1, 
   
    render: {
      sprite: {
        texture: 'img/wheel.png',
        xScale: 0.1,
        yScale: 0.1,                              
      }
    }  
  });

  let left = Bodies.circle(190,113,Math.ceil(50), { 
    density: 0.0005,
    friction: 0.8,
    frictionStatic: 0.8,
    frictionAir: 0.0001,
    //frictionAir: 0.001,
    restitution: 0.10,
    portal: -1,
    mass: 1,
    
    render: {
      sprite: {
        texture: 'img/wheel.png',
        xScale: 0.1,
        yScale: 0.1
      }
    }
  });
      
  let corpus = Bodies.rectangle(270,100,20,55, {
    render: {
      sprite: {
        texture: 'img/corpus.png',          
        xScale: 0.3,
        yScale: 0.3
      }
    }
  });

  let a = Constraint.create({
    render: {
      visible: state,
      lineWidth: 2,
    },
    bodyB: right,
    bodyA: corpus,
    pointA: { x:-90,y:-15 },
    pointB: { x: 0, y: 0 },
    stiffness: 0.8,    
    }, 
    { 
      isStatic: true 
  });

  let b = Constraint.create({
    render: {
      visible: state,
      lineWidth: 2,        
    },
    bodyB: right,
    bodyA: corpus,
    pointA: { x:-10,y:15 },
    pointB: { x: 0, y: 0 },
    stiffness: 0.2,     
  });

  let c = Constraint.create({
    render: {
      visible: state,
      lineWidth: 2,        
    },
    bodyB: left,
    bodyA: corpus,
    pointA: { x:90,y:-20 }, 
    pointB: { x: 0, y: 0 },
    stiffness: 0.8     
  });  

  let d = Constraint.create({
    render: {
      visible: state,
      lineWidth: 2,        
    },  
    bodyB: left,
    bodyA: corpus,
    pointA: { x:10,y:15 }, 
    pointB: { x:0, y:0 }, 
    stiffness: 0.2 
  });
  
  let v = Constraint.create({
    render: {
      visible: state,
      lineWidth: 2,     
    },  
    bodyB: right,
    bodyA: corpus,
    pointA: { x: -30, y: -35 }, 
    pointB: { x:0, y:0 }, 
    stiffness: 0.2 
  });

  let n = Constraint.create({
    render: {
      visible: state,
      lineWidth: 2,      
    },  
    bodyB: left,
    bodyA: corpus,
    pointA: { x: 10, y: -35 }, 
    pointB: { x:0, y:0 }, 
    stiffness: 0.2 
  });
        
  let car = [corpus,right,left,a,b,c,d];
  //var car = [corpus,right,left,a,b,c,d,v,n];
  return car;   
}

function reset() {
  World.clear(engine.world,true);
  Engine.clear(engine);    
}

function track() {
  for(i = 0; i < rights.length; i++){
    World.add(engine.world,[rights[i],ground]);
  }

  initialEngineBoundsMaxX = render.bounds.max.x
  initialEngineBoundsMaxY = render.bounds.max.y

  centerX = - 200
  centerY = - 200 

  Events.on(engine, 'beforeUpdate', function(event) {
    counter += 1;
    infCounter += 1;
    hero = rights[1];
 
    render.bounds.min.x = centerX + hero.bounds.min.x 
    render.bounds.max.x = centerX + hero.bounds.min.x + initialEngineBoundsMaxX
    render.bounds.min.y = centerY + hero.bounds.min.y
    render.bounds.max.y = centerY + hero.bounds.min.y + initialEngineBoundsMaxY    
  });
}
track();

document.body.addEventListener("keydown", function(e){ 
  speed = 10;    
  switch(e.which){      
    case 68:
      Body.setVelocity(hero, {x: speed, y: 0 });
      break;
    case 32:
      Body.setVelocity(hero, {x: 0, y: 0}); 
      break;    
  }
})