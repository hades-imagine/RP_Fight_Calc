$(document).ready(function () {
	//----------------------------------------------------------------------------------
	// Functions and classes
	//----------------------------------------------------------------------------------	
	function rollDice( dice ) {
		var total = 0;
		for (var i = 0, len = dice.length; i < len; i++) {
			total += Math.ceil(Math.random() * dice[i]);
		}
		return total;
	};

	function coinflip() {
		return Math.round(Math.random());
	};

	function clamp (n, min, max) {
		return Math.max(min, Math.min(n, max));
	};

	var windowController = {
		messages : {
			action : [],
			hit : [],
			damage : 0,
			status : [],
			hint : [],
			special : [],
			info : [],
			error : []
		},
		_formatMessage : {
			action : function (message) { return "Action: " + message + "<br />"; },
			hit : function (message) { return "[color=red][b]" + message + "[/b][/color]<br />"; },
			damage : function (message) {	return "[color=yellow]Damage: " + message + "[/color] "; },
			hint : function (message) { return "[color=purple]" + message + "[/color]<br />"; },
			special : function (message) { return "<br />[color=red]" + message + "[/color]"; }
		},
		_windowPanels : $( ".InputPanel" ),
		_activePanel : "",
		_verifyPanelExists : function( targetID ) {
			if( typeof targetID !== "string" ) return 0;
			if( targetID === "" ) return 0;
			if( this._windowPanels.filter( "#" + targetID ).length ) return 1;
			return 0;
		},
		
		_updatePanel : function() {
			if (this._activePanel === "") this._activePanel = this._windowPanels.first().attr("id");
			
			if ( !this._verifyPanelExists(this._activePanel) ) {
				console.log( "windowController._updatePanel: _activePanel has been set to an invalid value. No panel with ID (#" + this._activePanel + ") exists." );
				return;
			}

			this._windowPanels.find(":input").attr("checked", false);
			
			var targetPanel = $("#" + this._activePanel);
			if( targetPanel.is(':visible') ) {
				this._windowPanels.not( targetPanel ).hide()
				this._windowPanels.not( targetPanel ).filter(":input").attr("disabled", true);
			} else {
				var disabledPanels = this._windowPanels.filter(':visible');
				disabledPanels.fadeTo( 300, 0, function() {
					disabledPanels.hide();
					disabledPanels.attr("disabled", true);
					targetPanel.fadeIn( 300 );
					targetPanel.find(":input").attr("disabled", false);
				});
			}
		},
	
		switchToPanel : function( targetID ) { 
			if ( !this._verifyPanelExists( targetID ) ) {
				console.log( "windowController.switchToPanel: No panel with ID (#" + targetID + ") exists." );
				return;
			}
			
			this._activePanel = targetID;
			this._updatePanel();			
		},
		
		nextPanel : function() { 
			if (this._activePanel === "") {
				this._activePanel = this._windowPanels.first().attr("id");
				return;
			}
			
			if ( !this._verifyPanelExists(this._activePanel) ) {
				console.log( "windowController.nextPanel: _activePanel has been set to an invalid value. No panel with ID (#" + this._activePanel + ") exists." );
				return;
			}
			
			var targetPanel = this._windowPanels.siblings( "#" + this._activePanel ).next().attr("id");
		
			if (typeof targetPanel !== "undefined" ) {
				this._activePanel = targetPanel;
			} else {
				this._activePanel = this._windowPanels.first().attr("id"); //If already on last panel, loop around to first
			}
			
			this._updatePanel();
		},
		
		prevPanel : function() { 
			if (this._activePanel === "") {
				this._activePanel = this._windowPanels.last().attr("id");
				return;
			}
			
			if ( !this._verifyPanelExists(this._activePanel) ) {
				console.log( "windowController.prevPanel: _activePanel has been set to an invalid value. No panel with ID (#" + this._activePanel + ") exists." );
				return;
			}
			
			var targetPanel = this._windowPanels.siblings( "#" + this._activePanel ).prev().attr("id");
			if (typeof targetPanel !== "undefined" ) {
				this._activePanel = targetPanel;
			} else {
				this._activePanel = this._windowPanels.last().attr("id"); //If already on first panel, loop around to last
			}	
			
			this._updatePanel();
		},
		
		updateOutput: function() {
			$( "#CombatResult" ).empty();
			if( this.messages.action.length ) $( "#CombatResult" ).append( this._formatMessage.action( this.messages.action.join(" ") ));
			if( this.messages.hit.length ) $( "#CombatResult" ).append( this._formatMessage.hit( this.messages.hit.join("<br />") ));
			if( this.messages.damage ) $( "#CombatResult" ).append( this._formatMessage.damage( this.messages.damage ));
			if( this.messages.status ) $( "#CombatResult" ).append( this.messages.status.join(" ||| ") + "<br />");
			if( this.messages.hint.length ) $( "#CombatResult" ).append( this._formatMessage.hint( this.messages.hint.join("<br />") ));			
			if( this.messages.special.length ) $( "#CombatResult" ).append( this._formatMessage.special( this.messages.special.join("<br />") ));
			if( this.messages.info.length ) $( "#CombatResult" ).append( "<br />" + this.messages.info.join("<br />") );
			
			$( "#ErrorMessage" ).empty();
			if( this.messages.error.length ) $( "#ErrorMessage" ).append( this.messages.error.join("<br />") );		

			//clear messages from the queue once they have been displayed
			this.messages = {
				action : [],
				hit : [],
				damage : 0,
				fightersStatus : [],
				hint : [],
				special : [],
				info : [],
				error : []
			}
		},
		setActionButton : function ( name ) {
			$("#Take_Action").val( "Take action as " + name );
		},
		addAction : function( line ) { if( typeof line === "string" ) this.messages.action.push(line); },
		addHit : function( line ) { if( typeof line === "string" ) this.messages.hit.push(line); },
		addStatus : function( line ) { if( typeof line === "string" ) this.messages.status.push(line); },
		setDamage : function( damage ) { this.messages.damage = damage; },
		addHint : function( line ) { if( typeof line === "string" ) this.messages.hint.push(line); },
		addSpecial : function( line ) { if( typeof line === "string" ) this.messages.special.push(line); },
		addInfo : function( line ) { if( typeof line === "string" ) this.messages.info.push(line); },
		addError : function( line ) { if( typeof line === "string" ) this.messages.error.push(line); }
	};

	function arena(){
		if (!(this instanceof arena)) return new arena(); //protection against calling this as a function rather than instantiating it with new.
		this._fighters = [];	
		this._currentFighter;
		this.stage = this.pickStage();
	};
	
	arena.prototype = {
		addFighter : function ( settings ) {
			try {
				this._fighters.push( new fighter(settings) ); 
			} catch(err) {
				console.log(err.message);
				return 0;
			}
			
			return 1;
		},
		
		clearFighters : function () {
			this._fighters = [];
		},
		
		getActor : function () {
			return this._fighters[ this._currentFighter ];
		},
		
		getTarget : function () {
			return this._fighters[ 1 - this._currentFighter ]; //Just a placeholder in case I add actual targeting of attacks and group fights later
		},
		
		outputFighterStatus : function () {
			for (var i = 0, len = this._fighters.length; i < len; i++) windowController.addHint( this._fighters[i].getStatus() );
		},
		
		outputFighterStats : function () {
			for (var i = 0, len = this._fighters.length; i < len; i++) windowController.addHint( this._fighters[i].getStatBlock() );
		},
		
		nextFighter : function () {
			this._currentFighter = (this._currentFighter == this._fighters.length - 1) ? 0 : this._currentFighter + 1;
			
			if( this._fighters[this._currentFighter].isStunned ) {
				this._fighters[this._currentFighter].isStunned = false;
				this.nextFighter();
			} else {
				windowController.setActionButton( this._fighters[this._currentFighter].name );
			}
		},
		
		pickInitialActor : function () {
			this._currentFighter = Math.floor(Math.random() * this._fighters.length);
			windowController.setActionButton( this._fighters[this._currentFighter].name );
		},
		
		pickStage : function() {
			var stages = [
				"The Pit", 
				"RF:Wrestling Ring", 
				"Arena", 
				"Subway", 
				"Skyscraper Roof", 
				"Forest", 
				"Cafe", 
				"Street road", 
				"Alley", 
				"Park", 
				"RF:MMA Hexagonal Cage", 
				"Hangar", 
				"Swamp", 
				"RF:Glass Box", 
				"RF:Free Space" ];
			
			return stages[Math.floor(Math.random() * stages.length)];
		}, 
		
		turnUpkeep : function () {
			for (var i = 0, len = this._fighters.length; i < len; i++) {
				this._fighters[i].updateCondition();
				this._fighters[i].regen();
			}

			this.nextFighter();
		}
	};
	
	function fighter(settings){
		if (!(this instanceof fighter)) return new fighter(settings); //protection against calling this as a function rather than instantiating it with new.
		var errors = [];
		this.name = settings.Name;
	
		//Check numeric fields for invalid values
		var nonNumericFields = ["Name"];
		$.each(settings, function(key, value) {			
			if ((jQuery.inArray( key, nonNumericFields ) == -1) && (parseInt(value) != value)) errors.push( settings.Name + " settings are invalid: " + key + " cannot have a value of " + value + "." );
		});
		
		//Set stats from settings
		this._strength = (+settings.Strength);
		this._dexterity = (+settings.Dexterity);
		this._endurance = (+settings.Endurance);
		this._intellect = (+settings.Intellect);
		this._willpower = (+settings.Willpower);

		this._dizzyValue = 40 - this._intellect;
		this._koValue = 25;
		this._deathValue = 0;
		
		//Check stat points for conformity to rules
		if (this._strength > 10  || this._strength < 1) errors.push( settings.Name + "'s Strength is outside the allowed range (1 to 10).");		
		if (this._dexterity > 10 || this._dexterity < 1) errors.push( settings.Name + "'s Dexterity is outside the allowed range (1 to 10).");		
		if (this._endurance > 10 || this._endurance < 1) errors.push( settings.Name + "'s Endurance is outside the allowed range (1 to 10).");		
		if (this._intellect > 10 || this._intellect < 1) errors.push( settings.Name + "'s Intellect is outside the allowed range (1 to 10).");		
		if (this._willpower > 10 || this._willpower < 1) errors.push( settings.Name + "'s Willpower is outside the allowed range (1 to 10).");		
		
		var stattotal = this._strength + this._dexterity + this._endurance +  this._intellect +  this._willpower;
		if ( stattotal!= 20 )  errors.push( settings.Name + " has stats that are too high or too low (" + stattotal + " out of 20 points spent).");		

		if ( errors.length ) {
			for (var i = 0, len = errors.length; i < len; i++) windowController.addError( errors[i] );
			throw new Error( settings.Name + " was not created due to invalid settings." );
		}
		
		this._maxHP = 60 + this._endurance * 10;
		this._maxMana = this._intellect * 10;
		this._maxStamina = 100;
	
		this.hp = clamp( settings.HP, 0, this._maxHP);
		this.mana = clamp( settings.Mana, 0, this._maxMana);
		this.stamina = clamp( settings.Stamina, 0, this._maxStamina);
		this.cloth = clamp( settings.Cloth, 0, 100);
		
		this.isUnconscious = false;
		this.isDead = false;
		this.isRestrained = false;
		this.isStunned = false;
		this.isDisoriented = 0;
		this.isGrappledBy = []; 			
	};
	
	fighter.prototype = {
		strength : function () { 
			var total = this._strength;
			total -= this.isDisoriented;
			if (this.isRestrained) total = total / 2;
			total = Math.max(total, 1);
			total = Math.ceil(total);
			return total;
		},
		
		dexterity : function () { 
			var total = this._dexterity; 
			total -= this.isDisoriented;
			if (this.isRestrained) total = total / 2;
			total = Math.max(total, 1);
			total = Math.ceil(total);
			return total;
		},
		
		endurance : function () { 
			var total = this._endurance;
			total -= this.isDisoriented;
			total = Math.max(total, 1);
			total = Math.ceil(total);
			return total;
		},
		
		intellect : function () { 
			var total = this._intellect;
			total -= this.isDisoriented;
			total = Math.max(total, 1);
			total = Math.ceil(total);
			return total;
		},
		
		willpower : function () { 
			var total = this._willpower;
			total -= this.isDisoriented;
			total = Math.max(total, 1);
			total = Math.ceil(total);
			return total;
		},
		
		pickFatality : function() {
			var fatalities = [
			"Decapitation", 
			"Strangulation", 
			"Beating to death", 
			"Exposing internal organs", 
			"Blood loss", 
			"Heart damage", 
			"Brain damage", 
			"Breaking Neck", 
			"Breaking bones", 
			"Dismemberment", 
			"Crushing",
			"Severing the jaw", 
			"Remove top part of a head", 
			"Maceration", 
			"Brutality!", 
			"Slow and sensual death", 
			"Extremely staged and theatrical finisher" ];
			
			return fatalities[Math.floor(Math.random() * fatalities.length)];
		},
		
		regen : function () {
			if( !this.isUnconscious ) {
				this.mana += 3;
				this.stamina += this.endurance() / 2;
			} else {
				this.isStunned = true;
			}

			this.hp = Math.ceil(clamp( this.hp, 0, this._maxHP));
			this.mana = Math.ceil(clamp( this.mana, 0, this._maxMana));			
			this.stamina = Math.ceil(clamp( this.stamina, 0, this._maxStamina));
			this.cloth = Math.ceil(clamp( this.cloth, 0, 100));
		},
		
		getStatBlock : function () {
			return this.name + " stats: Strength:" + this.strength() + " Dexterity:" + this.dexterity() + " Endurance:" + this.endurance() + " Intellect:" + this.intellect();
		},
		
		getStatus : function () {
			return "[color=orange]" + this.name + "[/color][color=yellow] health: " + this.hp + "[/color][color=green] stamina: " + this.stamina + "[/color] mana: " + this.mana + "|" + this._maxMana + "[color=purple] cloth: " + this.cloth + "[/color]" 
		},
		
		updateCondition : function () {
			if ( this.isGrappledBy.length != 0 && !(this.isRestrained) ) this.isRestrained = true;
			if ( this.isGrappledBy.length == 0 && this.isRestrained ) this.isRestrained = false;
			
			if ( this.hp <= this._dizzyValue && !(this.isDisoriented) ) {
				this.isDisoriented = 1;
				windowController.addHit( this.name + " is permanently dizzy! Stats penalty!" );
			}
			
			if ( this.hp <= this._koValue && !(this.isUnconscious) ) {
				this.isUnconscious = true;
				windowController.addHit( this.name + " is permanently Knocked Out (or extremely dizzy, and can not resist)! Feel free to use this opportunity! " + this.name + " must not resist! Continue beating them to get a fatality suggestion." );
			}
			
			if ( this.hp <= this._deathValue && !(this.isDead) ) { 
				this.isDead = true;
				windowController.addHit( this.name + " dies in the next move (or is already dead, as you wish to RP it). CLAIM YOUR SPOILS and VICTORY and FINISH YOUR OPPONENT!" );
				windowController.addSpecial( "FATALITY SUGGESTION: " + this.pickFatality());
				windowController.addSpecial( "It is just a suggestion, you may not follow it if you don't want to." );
			}
		},
		actionLight : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			var damage = 0;
			var requiredStam = 20;
			var difficulty = 3;
			
			if (roll + attacker.dexterity() - target.dexterity() > difficulty)
			{
				damage = (roll / 2) + attacker.strength();
				if ( attacker.stamina < requiredStam )
				{
					damage = damage * (attacker.stamina / requiredStam);
					windowController.addHit( " Glancing Hit! " );
					windowController.addHint( attacker.name + " was too tired to deal full damage!" );
				} else {
					windowController.addHit( " HIT! " );
				}
			
				damage = Math.max(damage, 1);
				target.cloth -= 3;
			} else {
				windowController.addHit( " DODGE! " );
				windowController.addHint( target.name + " dodged the attack!" );
			}

			damage = Math.floor(damage);
			
			attacker.stamina -= requiredStam;
			target.stamina -= damage + attacker.intellect();
			target.hp -= damage;
			
			windowController.setDamage(damage);
		},
		
		actionHeavy : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			var damage = 0;
			var requiredStam = 35;
			var difficulty = 10;
			
			if (roll + attacker.dexterity() - target.dexterity() > difficulty)
			{
				damage = roll + (2 * attacker.strength());
				if ( attacker.stamina < requiredStam )
				{
					damage = damage * (attacker.stamina / requiredStam);
					windowController.addHit( " Glancing Hit! " );
					windowController.addHint( attacker.name + " was too tired to deal full damage!" );
				} else {
					windowController.addHit( " HIT! " );
				}

				damage = Math.max(damage, 1);
				target.cloth -= 5;
			} else {
				windowController.addHit( " DODGE! " );
				windowController.addHint( target.name + " dodged the attack!" );
			}

			damage = Math.floor(damage);
			
			attacker.stamina -= requiredStam;	
			target.hp -= damage;
			
			windowController.setDamage(damage);
		},	
		
		actionGrab : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			var damage = 0;
			var manaDamage = 0;
			var requiredStam = 40;
			var bonusStam = 0;
			var difficulty = 9;

			if (roll + attacker.strength() + attacker.dexterity() - target.dexterity() > difficulty)
			{				
				if( target.isGrappling( attacker ) ) { 
					windowController.addHit( attacker.name + " ESCAPED " + target.name + "'s HOLD! " + attacker.name + " can not use GRAB in next move!" );
					attacker.removeGrappler( target );
					bonusStam = 5;
				} else {
					damage = ((roll / 2) + attacker.strength()) / 2;
					manaDamage = (target.mana/2) + 3;
					
					if ( attacker.isGrappling( target ) ) { 
						windowController.addHit( " SUBMISSION " );
						windowController.addHint( target.name + " is in a SUBMISSION hold, taking damage!" );
						damage += attacker.strength() * 2;
						bonusStam = requiredStam / 2;
					} else {
						windowController.addHit( attacker.name + " GRABBED " + target.name + "! ");
						windowController.addHint( target.name + " is in a HOLD! They will be there until thrown or escape by using Grab move. In addition, " + attacker.name + " can use Grab for a submission hold or Tackle to throw them - dealing damage, but setting them free." );
						target.isGrappledBy.push( attacker.name );
					}

					if ( attacker.stamina < requiredStam ) {
						windowController.addHint( attacker.name + " was too tired to deal full damage." );
						damage = damage * (attacker.stamina / requiredStam);
						manaDamage = manaDamage * (attacker.stamina / requiredStam);
					}
				} 
				
				bonusStam += 5;
				damage = Math.max(damage, 1);
				target.cloth -= 4;
			} else {
				windowController.addHit( " FAILED! " );
				windowController.addHint( target.name + " resisted the grab attempt!" );
			}

			bonusStam = Math.floor(bonusStam);
			manaDamage = Math.floor(manaDamage);
			damage = Math.floor(damage);
			
			attacker.stamina += bonusStam;
			attacker.stamina -= requiredStam;	
			target.mana -= manaDamage;
			target.hp -= damage;
			
			windowController.setDamage(damage);
		},
		
		actionRip : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			var damage = 0;
				
			if ( attacker.isGrappling( target ) ) {
				target.cloth = target.cloth - roll * 2;
				windowController.addHit( attacker.name + " rips " + target.name + "'s clothes in a grab!" );
			} else {
				target.cloth = target.cloth - roll;
				windowController.addHit( attacker.name + " damages " + target.name + "'s clothes!" );
			}
		},
		
		actionTackle : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			var damage = 0;
			var bonusStam = 0;
			var requiredStam = 40;
			var difficulty = 7;

			if( attacker.stamina < requiredStam) {
				windowController.addHit( " CRITICAL MISS! " );
				windowController.addHint( "TIP: YOU NEED MORE STAMINA FOR TACKLE (40 at least)!" );
			} else if (roll + attacker.strength() + attacker.dexterity() - (target.dexterity() * 2) > difficulty )	{
				damage = (roll + attacker.strength())/4;
				
				if( attacker.isGrappling( target ) ) { 
					windowController.addHit( attacker.name + " THREW " + target.name + " on the ground! " + attacker.name + " can make another move in a row!" );
					windowController.addHint( " You are free from the GRAB. You should make your post, but you should only emote being hit, do not try to perform any other actions." );
					target.removeGrappler( attacker );
					target.isStunned = true;
				} else {
					windowController.addHit( attacker.name + " TACKLED " + target.name + " on the ground! " + attacker.name + " can make another move in a row!" );
					windowController.addHint( target.name + ": You should make your post, but you should only emote being hit, do not try to perform any other actions." );
					target.isStunned = true;
				}
				
				bonusStam = requiredStam / 2;
				target.stamina -= 40;
				damage = Math.max(damage, 1);
			} else {
				
				if ( attacker.isGrappling( target ) ) { //If the attacker's name DOES appear on the list of people grappling the target
					windowController.addHit( attacker.name + " THREW " + target.name + " on the ground! But no damage was done," + attacker.name + " can NOT make another move in a row!" );
					windowController.addHint( target.name + " You are free from the GRAB." );
					target.removeGrappler( attacker );
				} else {
					windowController.addHit( "MISS! " );
				}
			}

			bonusStam = Math.floor(bonusStam);
			damage = Math.floor(damage);
			
			attacker.stamina += bonusStam;
			attacker.stamina -= requiredStam;
			target.hp -= damage;
			
			windowController.setDamage(damage);
		},
		
		actionRanged : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			var damage = 0;	
			var requiredStam = 15;
			var requiredMana = 15;	
			var difficulty = 4;
			
			if (attacker.mana < requiredMana) {
				attacker.mana = 0;
				windowController.addHit( "CRITICAL MISS! " );
				windowController.addHint( "TIP: YOU NEED MORE MANA FOR MAGIC/RANGED ATTACKS (15 AT LEAST)!" );
			} else if ((roll + attacker.willpower() - target.willpower() > difficulty))	{
				damage = (roll/2) + (3 * attacker.intellect()) - (target.intellect() + (target.endurance()/2));
				if ( attacker.stamina < requiredStam )
				{
					damage = damage * (attacker.stamina / requiredStam);
					windowController.addHit( " Glancing Hit! " );
					windowController.addHint( attacker.name + " was too tired to deal full damage!" );
				} else {
					windowController.addHit( " RANGED/MAGIC HIT! " );
				}

				damage = Math.max(damage, 1);
				attacker.stamina -= requiredStam;
				attacker.mana -= requiredMana;
			} else {
				windowController.addHint( "MISS! " );
			}
			
			damage = Math.floor(damage);
			target.hp -= damage;
			
			windowController.setDamage(damage);
		},
		
		actionRest : function ( roll ) {
			var attacker = this;
			var damage = 0;
			
			attacker.stamina = attacker.stamina + (30 + attacker.endurance() * 2);
			attacker.hp += attacker.willpower();
			attacker.mana += attacker.willpower();
			windowController.addHit( attacker.name + " SKIPS MOVE, RESTING!" );
			windowController.addHint( attacker.name + " recovered. Stamina:" + (30 + attacker.endurance() * 2) + " | HP:" + attacker.willpower() + " | Mana:" + attacker.willpower() );
		},
		
		actionRun : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			var damage = 0;
			
			if (attacker.stamina >= 20)
			{
				windowController.addHint( attacker.name + " runs, increasing distance from" + target.name + ". " + target.name + " can only use ranged attacks or rest in the next move!");   
				attacker.stamina -= 20;
			} else {
				windowController.addHint( attacker.name + " is exhausted and can\'t run from  " + target.name + ". " );
				attacker.stamina -= 20;
			}
		},

		actionFumble : function ( action ) {
			var attacker = this;
			
			switch (action) 
			{
			case "Light":
				attacker.stamina -= 15;
				break;
			case "Heavy":
				attacker.stamina -=30;
				break;
			case "Grab":
				attacker.stamina -=35;
				break;
			case "Tackle":
				attacker.stamina -=35;
				break;
			case "Magic/Ranged":
				attacker.mana -= 10;
				attacker.stamina -= 5;
				break;
			case "Skip/Rest":
				windowController.addHint( attacker.name + " could not calm their nerves." );
				break;
			}
		},
		
		isGrappling : function ( target ) {
			if ( jQuery.inArray(this.name, target.isGrappledBy) != -1) return true;
			return false;
		},
		
		removeGrappler : function ( target ) {
			var grappleIndex = jQuery.inArray(target.name, this.isGrappledBy);
			this.isGrappledBy.splice( grappleIndex, 1 );
		}
	};

	//----------------------------------------------------------------------------------
	// One time events (Setting the default visibility of panels, for example)
	// Objects and variables not tied to a particular event
	//----------------------------------------------------------------------------------
	windowController.switchToPanel("Setup");
	var battlefield = new arena();
	
	//----------------------------------------------------------------------------------
	// Event Handlers
	//----------------------------------------------------------------------------------
	$( "#InitialSetup" ).submit( function( event ) {
		event.preventDefault();	
		battlefield.clearFighters();
		var fighterSettings = [ ];
		
		$( "fieldset[id^=Fighter]" ).each( function( index ) {
			var settings = { };
			$(this).find("input").each(function() {
					settings[this.name] = $(this).val();
			});
			fighterSettings.push( settings )
		});
		
		var fightersAdded = 0;
		for (var i = 0, len = fighterSettings.length; i < len; i++) {
			fightersAdded += battlefield.addFighter(fighterSettings[i]);
		};
		
		if( fightersAdded == fighterSettings.length ) {
			battlefield.pickInitialActor();
			windowController.nextPanel();
			windowController.addHit("Game started!");
			windowController.addHit("[b]FIGHTING STAGE: " + battlefield.stage + " - " + "[/b]");
			windowController.addHit( battlefield.getActor().name + " goes first!" );
			battlefield.outputFighterStatus();
			battlefield.outputFighterStats();
			windowController.addInfo( "[url=http://www.f-list.net/c/rendezvous%20fight/]Visit this page for stage descriptions[/url]" );
		} 	
		
		windowController.updateOutput();
	});
	
	$( "#CombatInput" ).submit( function( event ) {
		event.preventDefault();	
		var action = $( "input:radio[name=action]:checked" ).val();
		if(typeof action === 'undefined') return;
		var actor = battlefield.getActor();
		var roll = rollDice([20]);
		
		windowController.addAction(action);

		if (roll > 2) {
			actor["action" + action]( roll );
		} else {
			windowController.addHit( " FUMBLE! " );
			actor.actionFumble(action);
		}
		
		windowController.addInfo("Raw Dice Roll: " + roll);
		
		battlefield.turnUpkeep();
		battlefield.outputFighterStatus();
		//battlefield.outputFighterStats();			
		windowController.updateOutput();
	});
});