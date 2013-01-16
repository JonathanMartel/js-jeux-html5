// JavaScript Document

/**
 *
 * 
 * 
 * Documentaire
 *  - http://www.williammalone.com/articles/create-html5-canvas-javascript-game-character/1/
 *  - http://claudinebroke.it/physics/mini.php
 */


/**
 * Classe de l'objet GameEngine
 * Classe principal du framework 
 * Auteur : Jonathan Martel (jonathmartel@gmail.com)
 * 
 */

 //console.log = function(){};

 window.requestAnimFrame = (function(){
     return  window.requestAnimationFrame       ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame    ||
             window.oRequestAnimationFrame      ||
             window.msRequestAnimationFrame     ||
             function( callback ){
             	window.setTimeout(callback, 1000 / 60);
             };
})();
 
 
function GameEngine(frameRate, canvasID)
{
	this.update = new Update(frameRate, this);
	this.canvasID = canvasID;
	this.canvas = document.getElementById(canvasID);
	this.context = this.canvas.getContext("2d");
	this.gameObjects = {};
	
	if (typeof GameEngine.initialized == "undefined" )
	{
		GameEngine.prototype.demarre = function()
		{
			var self = this;
			
			window.requestAnimFrame = (function(){
				return  window.requestAnimationFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						window.oRequestAnimationFrame      ||
						window.msRequestAnimationFrame     ||
						function( callback ){
							window.setTimeout(callback, 1000 / 60);
						};
			})();
			//this.intervalID = setInterval(this.update.update.bind(this.update), 1000/this.frameRate);	// Attache le contexte this � la m�thode update()
			setTimeout(this.update.update.bind(this.update), 1000/60);	// Démarre après 1 frame
		};

		GameEngine.prototype.arret = function(iID)
		{
			/*window.cancelRequestAnimFrame = ( function() {
				return window.cancelAnimationFrame          ||
					window.webkitCancelRequestAnimationFrame    ||
					window.mozCancelRequestAnimationFrame       ||
					window.oCancelRequestAnimationFrame     ||
					window.msCancelRequestAnimationFrame        ||
					clearTimeout
			} )();
			setTimeout(function(){
					cancelRequestAnimFrame(iID);      	          
				}, 1*1000)
			this.update.frameNumber = 1;*/
		};

		GameEngine.prototype.ajouteObjet = function(nom, type, x, y, niveau, fctUpdate)
		{
			this.gameObjects[nom] = new GameObject(nom, type, x, y, niveau, fctUpdate); 
			return this.gameObjects[nom];
		};
		
		// Méthode statique de GameEngine.
		GameEngine.DegToRad = function(deg)
		{
			return (deg ? deg * (Math.PI/180) : 0);
		};

	}
	GameEngine.initialized = true;
}




/**
 * Classe de l'objet Update
 *  
 */

function Update(frameRate, parent)
{
	
	this.listeUpdate = [];
	this.frameRate = frameRate;
	this.frameNumber = 1;
	this.parent = parent;
	console.log(this.listeUpdate);
	
	if (typeof Update.initialized == "undefined" )
	{
		Update.prototype.update = function(){
			requestAnimFrame(this.update.bind(this));
			if(parent.canvas)
			{
				parent.canvas.width = parent.canvas.width;
			}
			if(this.listeUpdate)
			{
				/*console.log("Frame : " + this.frameNumber);
				console.log(this.listeUpdate[1].skip);
				console.log((!((this.frameNumber+1) % this.listeUpdate[1].skip)));
				console.log(!(this.frameNumber % this.listeUpdate[1].skip));*/
				
				for(var i = 0; i< this.listeUpdate.length; i++)
				{
					if(!(this.frameNumber % this.listeUpdate[i].skip))
					{
						this.listeUpdate[i].fonction();
					}
				}
				
			}
			if(this.parent.gameObjects)
			{
				for(var objet in this.parent.gameObjects)
				{
					//console.log(objet);
					this.parent.gameObjects[objet].update();
					for (var composant in this.parent.gameObjects[objet].composantes)
					{
						this.parent.gameObjects[objet].composantes[composant].update();
					}
				}
				
			}
			
			if(this.frameNumber >= this.frameRate)
			{
				this.frameNumber = 1;
			}
			else
			{
				this.frameNumber++;
			}
		};

		Update.prototype.add = function(callback, nomParam, actif, prio, skip) {
			var up = new UpdateItem(callback, nomParam, actif, prio, skip);
			this.listeUpdate.push(up);
		};
		Update.prototype.test = function(i){
			
			this.listeUpdate[i].fonction();
			
		};
	}
	Update.initialized = true ;
}





/**
 * Constructeur de l'objet UpdateItem
 *  
 * @param {function} fct
 * @param {Array} nomParam
 * @param {boolean} actif
 * @param {Number} prio
 * @param {Number} skip
 */

function UpdateItem(fct, nomParam, actif, prio, skip)
{
	this.fonction = fct;
	this.nomParam = nomParam || this.nomParam;
	this.actif = actif || this.actif;
	this.priorite = prio || this.priorite;
	this.skip = skip || this.skip;
}

UpdateItem.prototype.fonction = null;
UpdateItem.prototype.actif = true;
UpdateItem.prototype.nomParam = [];
UpdateItem.prototype.priorite = 0;
UpdateItem.prototype.skip = 1;



/**
 * 
 * @param {Object} nom
 * @param {Object} type
 * @param {Object} x
 * @param {Object} y
 * @param {Object} niveau
 * @param {function} fctUpdate
 */
function GameObject(nom, type, x, y, niveau, fctUpdate)
{
	this.nom = nom;
	this.type = type;
	this.x = x;
	this.y = y;
	this.posX = this.x;
	this.posY = this.y;
	this.niveau = niveau;
	this.composantes = {};
	this.callback = fctUpdate;
	this.start = null;
	this.velocite = 1;
	this.a = 1.00981;
	if (typeof GameObject.initialized == "undefined" )
	{
		/**
		 * 
		 */
		GameObject.prototype.update = function(){
			if(this.start)
			{
				this.start();
			}
			this.x = this.posX;
			this.y = this.posY;
			if(this.callback)
			{
				this.callback();
			}
		};

		/**
		 *  
		 */
		GameObject.prototype.dessine = function(context) {

		};

		GameObject.prototype.ajouteComposant = function (objet, nom, type, init, callback){
			this.composantes[nom] = new Composante(nom, type, callback);
			if(typeof init == 'function' && init)
			{
				init();
			}
			return this;
		};
		GameObject.prototype.ajouteAnimation = function (objet, nom, type, init, callback, oImage, context){
			this.composantes[nom] = new Animation(nom, type, callback, oImage, context, this);
			if(typeof init == 'function' && init)
			{
				init();
			}
			return this.composantes[nom];
		};
		
		GameObject.prototype.ajouteImage = function (nom, type, init, callback, oImage, x, y, context){
			this.composantes[nom] = new composantImage(nom, type, callback, oImage, x, y, context, this);
			if(typeof init == 'function' && init)
			{
				init();
			}
			return this.composantes[nom];
		};
		
		GameObject.prototype.ajouteControleur = function (nom, callback, oControl){
			this.composantes[nom] = new Controleur(nom, callback, oControl, this);
			
			return this.composantes[nom];
		};
		GameObject.prototype.ajouteRigidBody = function (nom, init, callback){
			this.composantes[nom] = new RigidBody(nom, callback, this);
			if(typeof init == 'function' && init)
			{
				init();
			}
			return this.composantes[nom];
		};
	
	}
	GameObject.initialized = true ;
	
	
	
}

/**
*
*
*/
function Composante(nom, type, callback)
{
	this.nom = nom || null;
	this.type = type || null;
	this.callback = callback || null;
	
	this._actif = true;
	
	if (typeof Composante.initialized == "undefined" )
	{
		Composante.prototype.active = function(){this._actif = true;};
		Composante.prototype.desactive = function(){this._actif = false;};
		Composante.prototype.update = function()
		{
			if(this._code)
			{
				this._code();
			}
			if(this.callback)
				this.callback();
		};
		Composante.prototype.ordonneCouche = function(image) {
			var aOrdre = new Array();
			for(var partie in image)
			{
				aOrdre[image[partie].ordre-1] = image[partie];
			}
			return aOrdre;
		};
	}
	GameObject.initialized = true;
	
}
/**
* La classe Animation hérite de la classe Composante
*
*/

function Animation(nom, type, callback, oImage, context, gameObjectParent)
{
	Composante.call(this, nom, type, callback);
	// Méthode privée
	function verifNombreFrame(oImage)
	{
		var nombreFrame = 1;
		for(var partie in oImage)
		{
			if(nombreFrame < oImage[partie].frame.length)
			{
				nombreFrame = oImage[partie].frame.length;
			}
		}
		return nombreFrame;
			
	}

	this.nombreFrame = verifNombreFrame(oImage);
	this.animFrame = 1;
	this.oImage = oImage;
	this.context = context;
	this.gameObjectParent = gameObjectParent;
	this.actif = false;
	
	
	if ( typeof Animation.initialized == "undefined" ) {
		// Recopie des éléments au moyen d'une simple boucle
		for (var element in Composante.prototype ) {
			Animation.prototype[element] = Composante.prototype[element];
		}
			
			
		Animation.prototype.anim = function(){
			aAnimation = this.ordonneCouche(this.oImage);
			
			for(var partie in aAnimation)
			{
				this.context.save();
				if(aAnimation[partie].frame[this.animFrame])
					var frame = this.animFrame;
				else
					var frame = 1;

				if(aAnimation[partie].frame[frame].rotation)
				{
					var tX = aAnimation[partie].frame[frame].rotX+this.gameObjectParent.x+aAnimation[partie].frame[frame].posX;
					var tY = aAnimation[partie].frame[frame].rotY+this.gameObjectParent.y+aAnimation[partie].frame[frame].posY;
					this.context.translate(tX, tY);
					// Perform the rotation
					this.context.rotate(GameEngine.DegToRad(aAnimation[partie].frame[frame].rotation));
					// Translate back to the top left of our image
					this.context.translate(-tX, -tY);
				}
				if(aAnimation[partie].frame[frame].scale != 1)
				{
					this.context.scale(aAnimation[partie].frame[frame].scale, aAnimation[partie].frame[frame].scale);
				}
				this.context.drawImage(aAnimation[partie], this.gameObjectParent.x+aAnimation[partie].frame[frame].posX, this.gameObjectParent.y+  aAnimation[partie].frame[frame].posY);
				this.context.restore();
			
			}
			this.animFrame++;
			if(this.animFrame > this.nombreFrame)
				this.animFrame = 1;
		};
		Animation.prototype.fixe = function(frame){
			aAnimation = this.ordonneCouche(this.oImage);
			for(var partie in aAnimation)
			{
				this.context.save();
				if(frame > this.nombreFrame)
				{
					frame = this.nombreFrame;
				}
				
				if(aAnimation[partie].frame[frame] == undefined)
				{
					frame = 1
				}
				if(aAnimation[partie].frame[frame].rotation)
				{
					var tX = aAnimation[partie].frame[frame].rotX+this.gameObjectParent.x+aAnimation[partie].frame[frame].posX;
					var tY = aAnimation[partie].frame[frame].rotY+this.gameObjectParent.y+aAnimation[partie].frame[frame].posY;
					this.context.translate(tX, tY);
					// Perform the rotation
					this.context.rotate(GameEngine.DegToRad(aAnimation[partie].frame[frame].rotation));
					// Translate back to the top left of our image
					this.context.translate(-tX, -tY);
				}
				if(aAnimation[partie].frame[frame].scale != 1)
				{
					this.context.scale(aAnimation[partie].frame[frame].scale, aAnimation[partie].frame[frame].scale);
				}
				this.context.drawImage(aAnimation[partie], this.gameObjectParent.x+aAnimation[partie].frame[frame].posX, this.gameObjectParent.y+  aAnimation[partie].frame[frame].posY);
				this.context.restore();
			}
			
		};
		Animation.prototype.arret = function(frame){
			if(frame)
			{
				if(frame < 1 || frame >= this.nombreFrame)
					frame =1;
			}
			else 
			{
				frame = this.animFrame;
			}
			
			this._code = function(){this.fixe(frame)};
			this.actif = false;
		};
		Animation.prototype.demarre = function(){
			this._code = this.anim;
			this.actif = true;
		};
		
		Animation.prototype.termine = function(){
			this._code = this.termine;
			aAnimation = this.ordonneCouche(this.oImage);
			for(var partie in aAnimation)
			{
				var frame = this.animFrame;
				this.context.save();
				if(aAnimation[partie].frame[frame] == undefined)
				{
					frame = 1
				}
				if(aAnimation[partie].frame[frame].rotation)
				{
					var tX = aAnimation[partie].frame[frame].rotX+this.gameObjectParent.x+aAnimation[partie].frame[frame].posX;
					var tY = aAnimation[partie].frame[frame].rotY+this.gameObjectParent.y+aAnimation[partie].frame[frame].posY;
					this.context.translate(tX, tY);
					// Perform the rotation
					this.context.rotate(GameEngine.DegToRad(aAnimation[partie].frame[frame].rotation));
					// Translate back to the top left of our image
					this.context.translate(-tX, -tY);
				}
				if(aAnimation[partie].frame[frame].scale != 1)
				{
					this.context.scale(aAnimation[partie].frame[frame].scale, aAnimation[partie].frame[frame].scale);
				}
				this.context.drawImage(aAnimation[partie], this.gameObjectParent.x+aAnimation[partie].frame[frame].posX, this.gameObjectParent.y+  aAnimation[partie].frame[frame].posY);
				this.context.restore();
			}
			this.animFrame++;
			if(this.animFrame > this.nombreFrame)
			{	
				this.animFrame = this.nombreFrame;
				this.arret();
			}
			
		};
		
		Animation.initialized = true;
	}

	
}

/**
* La classe composantImage hérite de la classe Composante
*
*/

function composantImage(nom, type, callback, oImage, x, y, context, gameObjectParent)
{
	Composante.call(this, nom, type, callback);
	this.oImage = oImage;
	this.x =x;
	this.y = y;
	this.context = context;
	this.gameObjectParent = gameObjectParent;
	if ( typeof composantImage.initialized == "undefined" ) {
		// Recopie des éléments au moyen d'une simple boucle
		for (var element in Composante.prototype ) {
			composantImage.prototype[element] = Composante.prototype[element];
		}
		
		composantImage.prototype.dessine = function() 
		{
			aImage = this.ordonneCouche(this.oImage);
			var frame = 1;
			for( var partie in aImage)
			{
				this.context.save();
				if(aImage[partie].frame[frame].rotation)
				{
					var tX = aImage[partie].frame[frame].rotX+this.gameObjectParent.x+aImage[partie].frame[frame].posX;
					var tY = aImage[partie].frame[frame].rotY+this.gameObjectParent.y+aImage[partie].frame[frame].posY;
					this.context.translate(tX, tY);
					// Perform the rotation
					this.context.rotate(GameEngine.DegToRad(aImage[partie].frame[frame].rotation));
					// Translate back to the top left of our image
					this.context.translate(-tX, -tY);
				}
				if(aImage[partie].frame[frame].scale != 1)
				{
					this.context.scale(aImage[partie].frame[frame].scale, aImage[partie].frame[frame].scale);
				}
				this.context.drawImage(aImage[partie], this.gameObjectParent.x+this.x + aImage[partie].frame[frame].posX, this.gameObjectParent.y+ + this.y + aImage[partie].frame[frame].posY);
				this.context.restore();
			}
		 };	
		composantImage.initialized = true;
	}
	
	this._code = this.dessine;
	
}

/**
* La classe Controleur hérite de la classe Composante
*
*/

function Controleur(nom, callback, oControl, gameObjectParent)
{
	Composante.call(this, nom, null, callback);
	this.oControl = oControl;
	this.gameObjectParent = gameObjectParent;
	
	if ( typeof Controleur.initialized == "undefined" ) {
		// Recopie des éléments au moyen d'une simple boucle
		for (var element in Composante.prototype ) {
			Controleur.prototype[element] = Composante.prototype[element];
		}
		
		 Controleur.prototype.control = function(e) {
			var cle = e.keyCode ? e.keyCode : e.charCode;
			if(e.type == 'keydown')
			{
				if(this.oControl['down'])
				{
					if(this.oControl['down'][cle])
					{
						this.oControl['down'][cle]();
					}
				}
			}
			else if(e.type == 'keyup')
			{
				if(this.oControl['up'])
				{
					if(this.oControl['up'][cle])
					{
						this.oControl['up'][cle]();
					}
				}
			}
			
		 };	
		Controleur.initialized = true;
	}
	var that = this;
	document.addEventListener('keydown', this.control.bind(this), false);
	document.addEventListener('keyup', this.control.bind(this), false);
	
	//this._code = this.beep;
	
}

/**
* La classe RigidBody hérite de la classe Composante
*
*/

function RigidBody(nom, callback, gameObjectParent)
{
	Composante.call(this, nom, null, callback);
	this.gameObjectParent = gameObjectParent;
	this.g = 1.000981;
	if ( typeof RigidBody.initialized == "undefined" ) {
		// Recopie des éléments au moyen d'une simple boucle
		for (var element in Composante.prototype ) {
			RigidBody.prototype[element] = Composante.prototype[element];
		}
		
		 RigidBody.prototype.gravite = function() 
		 {
			if(this.gameObjectParent.posY <350)
			{
				this.gameObjectParent.velocite = this.gameObjectParent.velocite*this.g*this.g*1.06;
				this.gameObjectParent.posY +=this.gameObjectParent.velocite;
				console.log(this.gameObjectParent.velocite);
			}
			else
			{
				this.gameObjectParent.velocite = 1;
			}
		 };	
		RigidBody.initialized = true;
	}

	this._code = this.gravite;
	
}