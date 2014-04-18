//----------------------------------------------------------------------------------
function rollDice( dice ) {
	var total = 0;
	for (var i = 0, len = dice.length; i < len; i++) {
		total += Math.ceil(Math.random() * dice[i]);
	}
	return total;
}

function coinflip() {
	return Math.round(Math.random());
}

function clamp (n, min, max) {
	return Math.max(min, Math.min(n, max));
}
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
function formatCombatText (lines, section) {
	switch(section)
	{
	case "action": 
		return "Action: " + lines;
		break;
	case "hit": 	
		return "[color=red][b]" + lines.join("<br />") + "[/b][/color]";
		break;
	case "damage": 
		return "[color=yellow]Damage: " + lines + "[/color] ";
		break;
	case "hint":
		return "[color=purple]" + lines.join("<br />") + "[/color]";
		break;
	case "special":
		return "<br />[color=red]" + lines.join("<br />") + "[/color]";
		break;
	default:
		return "Unknown format option (" + section + ") for message beginning with: " + lines[0];
	}
}
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
arena.prototype.stages = ["The Pit", "RF:Wrestling Ring", "Arena", "Subway", "Skyscraper Roof", "Forest", "Cafe", "Street road", "Alley", "Park", "RF:MMA Hexagonal Cage", "Hangar", "Swamp", "RF:Glass Box", "RF:Free Space"];

function arena(){
	if (!(this instanceof arena)) return new arena();
	this.fighters = new Array();	
	this.stage = this.stages[Math.floor(Math.random() * this.stages.length)];
	this.currentActor = coinflip();
}

arena.prototype.addFighter = function ( settings ) {
	this.fighters.push( new fighter(settings) );
}

arena.prototype.setActionButton = function () {
	var match = "As " + this.fighters[this.currentActor].name;
	
	$( "#CombatInput" ).find( "input[type='submit']" ).each( function () {
		$(this).attr("disabled", ( $(this).val() != match ));
	});
}

arena.prototype.setCurrentActor = function ( n ) {
	if( isNaN(n) ) {
		this.currentActor = (this.currentActor == this.fighters.length - 1) ? 0 : this.currentActor + 1;
	} else if(0 <= n <= this.fighters.length) { 
		this.currentActor = n;
	} else {
		console.log( "Cannot setCurrentActor: Invalid Actor number." );
	}
	
	if( this.fighters[this.currentActor].isStunned ) {
		this.fighters[this.currentActor].isStunned = false;
		this.setCurrentActor();
	} else {
		this.setActionButton();
	}
}

arena.prototype.actionLight = function ( a, b, roll ) {
	var attacker = this.fighters[a];
	var target = this.fighters[b];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
	var requiredStam = 20;
	var difficulty = 3;
	if (roll + attacker.dexterity() - target.dexterity() > difficulty)
	{
		outcome.damage = (roll / 2) + attacker.strength() - (target.endurance() / 2);
		if ( attacker.stamina < requiredStam )
		{
			outcome.damage = outcome.damage * (attacker.stamina / requiredStam);
			outcome.hit.push( " Glancing Hit! " );
			outcome.hint.push( attacker.name + " was too tired to deal full damage!" );
		} else {
			outcome.hit.push( " HIT! " );
		}
		
		outcome.damage = Math.max(outcome.damage, 1);
		target.cloth -= 3;
	} else {
		outcome.hit.push( " DODGE! " );
		outcome.hint.push( target.name + " dodged the attack!" );
	}

	target.stamina -= outcome.damage + attacker.intellect();
	outcome.damage = Math.floor(outcome.damage);
	attacker.stamina -= requiredStam;
	target.hp -= outcome.damage;
	return outcome;
}

arena.prototype.actionHeavy = function ( a, b, roll ) {
	var attacker = this.fighters[a];
	var target = this.fighters[b];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
	var requiredStam = 35;
	var difficulty = 7;
	if (roll + attacker.dexterity() - target.dexterity() > difficulty)
	{
		outcome.damage = roll + (3 * attacker.strength()) - (2 * target.endurance());
		if ( attacker.stamina < requiredStam )
		{
			outcome.damage = outcome.damage * (attacker.stamina / requiredStam);
			outcome.hit.push( " Glancing Hit! " );
			outcome.hint.push( attacker.name + " was too tired to deal full damage!" );
		} else {
			outcome.hit.push( " HIT! " );
		}

		outcome.damage = Math.max(outcome.damage, 1);
		target.cloth -= 5;
	} else {
		outcome.hit.push( " DODGE! " );
		outcome.hint.push( target.name + " dodged the attack!" );
	}
	
	attacker.stamina -= requiredStam;	
	outcome.damage = Math.floor(outcome.damage);
	target.hp -= outcome.damage;
	return outcome;
}

arena.prototype.actionGrab = function ( a, b, roll ) {
	var attacker = this.fighters[a];
	var target = this.fighters[b];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
	var requiredStam = 40;
	var difficulty = 9;
	if (roll + attacker.strength() + attacker.dexterity() - target.dexterity() > difficulty)
	{
		if(target.isGrappling[0] && (target.isGrappling[1] == a)) 
		{
			target.isGrappling[0] = false;
			attacker.isRestrained = false;
			attacker.stamina += 5;
            outcome.hit.push( attacker.name + " ESCAPED " + target.name + "'s HOLD! " + attacker.name + " can not use GRAB in next move!" );
		} else {
			outcome.damage = ((roll / 2) + attacker.strength() - target.endurance()) / 2;
			outcome.hit.push( attacker.name + " GRABBED " + target.name + "! ");
			if (attacker.isGrappling[0] && (attacker.isGrappling[1] == b)) { 
				if ( attacker.stamina < requiredStam )
				{
					outcome.damage = outcome.damage * (attacker.stamina / requiredStam);
					outcome.hit.push( " STRUGGLE " );
					outcome.hint.push( attacker.name + " was too tired to deal full damage!" );
				} else {
					outcome.hit.push( " SUBMISSION " );
					outcome.hint.push( target.name + " is in a SUBMISSION hold, taking damage!" );
					outcome.damage += attacker.strength() * 2;
					target.mana /= 2;
					target.mana -= 3;
				}
				attacker.stamina -= this.requiredStam/2;
			} else {
				outcome.hint.push( target.name + " is in a HOLD! They will be there until thrown or escape by using Grab move. In addition, " + attacker.name + " can use Grab for a submission hold or Tackle to throw them - dealing damage, but setting them free." );
				target.mana /= 2;
				target.mana -= 3;
			}
			attacker.isGrappling[0] = true;
			attacker.isGrappling[1] = b;
			target.isRestrained = true;
		} 
		requiredStam -= 5;
		outcome.damage = Math.max(outcome.damage, 1);
		target.cloth -= 4;
	} else {
		outcome.hit.push( " FAILED! " );
		outcome.hint.push( target.name + " resisted the grab attempt!" );
	}
	attacker.stamina -= requiredStam;	
	outcome.damage = Math.floor(outcome.damage);
	target.hp -= outcome.damage;
	return outcome;	
}

arena.prototype.actionRip = function ( a, b, roll ) {
	var attacker = this.fighters[a];
	var target = this.fighters[b];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
		
	if (attacker.isGrappling[0] && (attacker.isGrappling[1] == b)) {
		target.cloth = target.cloth - roll * 2;
		outcome.hit.push( attacker.name + " rips " + target.name + "'s clothes in a grab!" );
	} else {
		target.cloth = target.cloth - roll;
		outcome.hit.push( attacker.name + " damages " + target.name + "'s clothes!" );
	}
	return outcome;
}

arena.prototype.actionTackle = function ( a, b, roll ) {
	var attacker = this.fighters[a];
	var target = this.fighters[b];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
	var requiredStam = 40;
	var difficulty = 7;
	
	if( attacker.stamina < requiredStam) {
		attacker.stamina = 0;
		outcome.hit.push( " CRITICAL MISS! " );
		outcome.hint.push( "TIP: YOU NEED MORE STAMINA FOR TACKLE (40 at least)!" );
	} else if (roll + attacker.strength() + attacker.dexterity() - (target.dexterity() * 2) > difficulty )	{
		outcome.damage = (roll + attacker.strength() - target.endurance())/4;
		
		if( attacker.isGrappling[0] && (attacker.isGrappling[1] == b)) {
			outcome.hit.push( attacker.name + " TACKLED " + target.name + " on the ground! " + attacker.name + " can make another move in a row!" );
			outcome.hint.push( target.name + ": You should make your post, but you should only emote being hit, do not try to perform any other actions." );
			target.isStunned = true;
		} else {
			outcome.hit.push( attacker.name + " THREW " + target.name + " on the ground! " + attacker.name + " can make another move in a row!" );
			outcome.hint.push( " You are free from the GRAB. You should make your post, but you should only emote being hit, do not try to perform any other actions." );
			attacker.isGrappling[0] = false;
			target.isRestrained = false;
			target.isStunned = true;
		}
		
		attacker.stamina -= requiredStam / 2;
		target.stamina -= 40;
		outcome.damage = Math.max(outcome.damage, 1);
	} else {
		outcome.hit.push( "MISS! " );
		if (attacker.isGrappling[0] && (attacker.isGrappling[1] == b))
		{
			attacker.isGrappling[0] = false;
			target.isRestrained = false;
            outcome.hit.push( attacker.name + " THREW " + target.name + " on the ground! But no damage was done," + attacker.name + " can NOT make another move in a row!" );
			outcome.hint.push( target.name + " You are free from the GRAB." );
		}
		attacker.stamina -= requiredStam;
	}

	outcome.damage = Math.floor(outcome.damage);
	target.hp -= outcome.damage;
	return outcome;
}

arena.prototype.actionRanged = function ( a, b, roll ) {
	var attacker = this.fighters[a];
	var target = this.fighters[b];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };	
	var requiredStam = 15;
	var requiredMana = 15;	
	var difficulty = 4;
	if (attacker.mana < requiredMana) {
		attacker.mana = 0;
		outcome.hit.push( "CRITICAL MISS! " );
		outcome.hint.push( "TIP: YOU NEED MORE MANA FOR MAGIC/RANGED ATTACKS (15 AT LEAST)!" );
	} else if ((roll + attacker.willpower() - target.willpower() > difficulty))	{
		outcome.damage = (roll/2) + (3 * attacker.intellect()) - (target.intellect() + (target.endurance()/2));
		if ( attacker.stamina < requiredStam )
		{
			outcome.damage = outcome.damage * (attacker.stamina / requiredStam);
			outcome.hit.push( " Glancing Hit! " );
			outcome.hint.push( attacker.name + " was too tired to deal full damage!" );
		} else {
			outcome.hit.push( " RANGED/MAGIC HIT! " );
		}

		outcome.damage = Math.max(outcome.damage, 1);
		attacker.stamina -= requiredStam;
		attacker.mana -= requiredMana;
	} else {
		outcome.hint.push( "MISS! " );
	}
	
	outcome.damage = Math.floor(outcome.damage);
	target.hp -= outcome.damage;
	return outcome;
}

arena.prototype.actionRest = function ( a ) {
	var attacker = this.fighters[a];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
	
	attacker.stamina = attacker.stamina + (30 + attacker.endurance() * 2);
	attacker.hp += attacker.willpower();
	attacker.mana += attacker.willpower();
	outcome.hit.push( attacker.name + " SKIPS MOVE, RESTING!" );
    outcome.hint.push( attacker.name + " recovered. Stamina:" + (30 + attacker.endurance() * 2) + " | HP:" + attacker.willpower() + " | Mana:" + attacker.willpower() );

	return outcome;
}

arena.prototype.actionRun = function ( a, b ) {
	var attacker = this.fighters[a];
	var target = this.fighters[b];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
	
	if (attacker.stamina >= 20)
	{
		outcome.hint.push( attacker.name + " runs, increasing distance from" + target.name + ". " + target.name + " can only use ranged attacks or rest in the next move!");   
		attacker.stamina -= 20;
	} else {
		outcome.hint.push( attacker.name + " is exhausted and can\'t run from  " + target.name + ". " );
		attacker.stamina -= 20;
	}
	return outcome;
}

arena.prototype.actionFumbled = function ( a, action ) {
	var attacker = this.fighters[a];
	var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
	outcome.hit.push( " FUMBLE! " );
	
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
		outcome.hint.push( attacker.name + " could not calm their nerves." );
		break;
	}
	return outcome;
}

arena.prototype.turnUpkeep = function () {
	var message = {};
	for (var i = 0, len = this.fighters.length; i < len; i++) {
		message = this.fighters[i].updateCondition();
		this.fighters[i].regen();
	}
	this.setCurrentActor();
	return message;
}

arena.prototype.postOutcome = function (outcome, action, roll, special) {
	$( "#CombatResult" ).empty();
	if(typeof action !== 'undefined') $( "#CombatResult" ).append( formatCombatText(action, "action") + "<br />" );	
	$( "#CombatResult" ).append( formatCombatText(outcome.hit, "hit") + "<br />" );
	if(typeof outcome.damage !== 'undefined') {
		if(outcome.damage != 0) $( "#CombatResult" ).append( formatCombatText(outcome.damage, "damage") + "<br />" );
	}
	$( "#CombatResult" ).append( this.fighters[0].getStatus() + " ||| " + this.fighters[1].getStatus() + "<br />" );
	$( "#CombatResult" ).append( formatCombatText(outcome.hint, "hint") + "<br />" );
	if(typeof special !== 'undefined') $( "#CombatResult" ).append( formatCombatText(special, "special") + "<br />" );
	if(typeof roll !== 'undefined')$( "#CombatResult" ).append("<br />Raw Dice Roll: " + roll);
}
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
fighter.prototype.maxHP = 100;
fighter.prototype.maxStamina = 100;
fighter.prototype.maxCloth = 100;
fighter.prototype.nonNumericFields = ["Name"];

fighter.prototype.dizzyValue = 40;
fighter.prototype.koValue = 25;
fighter.prototype.deathValue = 0;

fighter.prototype.fatalities = ["Decapitation", "Strangulation", "Beating to death", "Exposing internal organs", "Blood loss", "Heart damage", "Brain damage", "Breaking Neck", "Breaking bones", "Dismemberment", "Crushing", "Severing the jaw", "Remove top part of a head", "Maceration", "Brutality!", "Slow and sensual death", "Extremely staged and theatrical finisher"];

function fighter(settings){
	if (!(this instanceof fighter)) return new fighter(settings);
	this.name = settings.Name || "Unnamed Fighter";

	this.maxMana = settings.Intellect * 10;

	this.hp = settings.HP || this.maxHP;
	this.mana = settings.Mana || this.maxMana;
	this.stamina = settings.Stamina || this.maxStamina;
	this.cloth = settings.Cloth || this.maxCloth;

	this.hp = Math.ceil( clamp( this.hp, 0, this.maxHP) );
	this.mana = Math.ceil( clamp( this.mana, 0, this.maxMana) );
	this.stamina = Math.ceil( clamp( this.stamina, 0, this.maxStamina) );
	this.cloth = Math.ceil( clamp( this.cloth, 0, this.maxCloth) );

	this.isDisoriented = 0;
	this.isUnconscious = false;
	this.isDead = false;
	this.isGrappling = [false, 0]; 
	this.isRestrained = false;
	this.isStunned = false;

	this.strength = function () { 
		var total = settings.Strength;
		total -= this.isDisoriented;
		total -= this.isRestrained ? total / 2 : 0;
		return total;
	};

	this.dexterity = function () { 
		var total = settings.Dexterity; 
		total -= this.isDisoriented;
		total -= this.isRestrained ? total / 2 : 0;
		return total;
	};
	
	this.endurance = function () { 
		var total = settings.Endurance;
		total -= this.isDisoriented;
		return total;
	};
	
	this.intellect = function () { 
		var total = settings.Intellect;
		total -= this.isDisoriented;
		return total;
	};
	
	this.willpower = function () { 
		var total = settings.Willpower;
		total -= this.isDisoriented;
		return total;
	};
}

fighter.prototype.regen = function () {
	this.hp = Math.ceil( clamp( this.hp, 0, this.maxHP) );
	if( !this.isUnconscious ) this.mana += 3;
	this.mana = Math.ceil( clamp( this.mana, 0, this.maxMana) );
	if( !this.isUnconscious ) this.stamina += this.endurance() / 2;
	this.stamina = Math.ceil( clamp( this.stamina, 0, this.maxStamina) );
	this.cloth = Math.ceil( clamp( this.cloth, 0, this.maxCloth) );
	if( this.isUnconscious ) this.isStunned = true;
}

fighter.prototype.getStatBlock = function () {
	return this.name + " stats: Strength:" + this.strength() + " Dexterity:" + this.dexterity() + " Endurance:" + this.endurance() + " Intellect:" + this.intellect();
}

fighter.prototype.getStatus = function () {
	return "[color=orange]" + this.name + "[/color][color=yellow] health: " + this.hp + "[/color][color=green] stamina: " + this.stamina + "[/color] mana: " + this.mana + "|" + this.maxMana + "[color=purple] cloth: " + this.cloth + "[/color]" 
}

fighter.prototype.updateCondition = function () {
	var message = { "hit": [ ], "special": [ ] };
	
	if( this.hp <= this.dizzyValue && !(this.isDisoriented) ) {
		this.isDisoriented = true;
		message.hit.push( this.name + " is permanently dizzy! Stats penalty!" );
	}
	
	if( this.hp <= this.koValue && !(this.isUnconscious) ) {
		this.isUnconscious = true;
		message.hit.push( this.name + " is permanently Knocked Out (or extremely dizzy, and can not resist)! Feel free to use this opportunity! " + this.name + " must not resist! Continue beating them to get a fatality suggestion." );
	}
	
	if( this.hp <= this.deathValue && !(this.isDead) ) { 
		this.isDead = true;
		console.log( "Killed" + this.name );
		message.hit.push( this.name + " dies in the next move (or is already dead, as you wish to RP it). CLAIM YOUR SPOILS and VICTORY and FINISH YOUR OPPONENT!" );
		message.special.push( "FATALITY SUGGESTION: " + this.fatalities[Math.floor(Math.random() * this.fatalities.length)] );
		message.special.push( "It is just a suggestion, you may not follow it if you don't want to." );
	}
	return message;
}

fighter.prototype.checkSettingsValidity = function (settings) {
	var errors = [ ];
	//Check settings for NaN values
	$.each(settings, function(key, value){
		if (value != value) {
			errors.push( settings.Name + "-- " + key + " has an invalid value." );
		}
	});

	//Check for conformity to rules
	var statpoints = 20;
	var stattotal = settings.Strength + settings.Dexterity + settings.Endurance + settings.Intellect + settings.Willpower;
	if( stattotal != statpoints && errors.length == 0 ) errors.push( settings.Name + "-- Stat totals (" + stattotal + ") are not equal to max points! Max: " + statpoints );
	
	return errors;
}
//----------------------------------------------------------------------------------

$(document).ready(function () {
	// Hide and lock the gameplay panel, and make sure the setup panel is visible and unlocked.
	$( "#Setup" ).show();
	$(" #Setup :input").attr("disabled", false);
	$( "#Gameplay" ).hide();
	$(" #Gameplay :input").attr("disabled", true);
	$(" #Gameplay :input").attr("checked", false);
	
	//Create the arena
	var battlefield = new arena();
	
	// Check and Submit fighter data from the Setup form, then start battle.
	$( "#InitialSetup" ).submit( function( event ) {
		event.preventDefault();
		var message_lines = [ ];
		var fighterSettings = [ ];

		// Get stats for each fighter from each form fieldset with the appropriate 'Fighter' ID, then check for errors, and save settings for later.
		$( "fieldset[id^=Fighter]" ).each( function( index ) {
			var settings = { };
			var errors = [ ];

			$(this).find("input").each(function() {
					settings[this.name] = ( jQuery.inArray(this.name, fighter.prototype.nonNumericFields) == -1) ? Number($(this).val()) : $(this).val();
			});

			//check for errors
			errors = errors.concat( fighter.prototype.checkSettingsValidity(settings) );
			message_lines = message_lines.concat(errors);
			
			//if there are no errors, save the associative array of settings for each fighter as an entry in the fighterSettings array, to be used in populating the arena once all data has been checked.
			if (errors.length == 0) fighterSettings.push( settings );
		});
	
		//if there have been no error messages: 
		//   - populate the arena
		//   - switch from the Setup panel to the Gameplay panel
		//   - do any initial setup before the first round begins
		//   - and then print the game started message to the result box
		if (message_lines.length == 0) {
			battlefield.addFighter( fighterSettings[0] );
			battlefield.addFighter( fighterSettings[1] );

			$(" #Setup :input").attr("disabled", true);
			$(" #Gameplay :input").attr("disabled", false);
			$( "#Setup" ).fadeTo( 300, 0, function() {
				$( "#Setup" ).hide();
				$( "#Gameplay" ).fadeIn( 300 );
			});
			
			$(" #F1_Action").val( "As " + battlefield.fighters[0].name );
			$(" #F2_Action").val( "As " + battlefield.fighters[1].name );

			battlefield.setActionButton();

			var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] }; 
			outcome.hit.push("Game started!");
			outcome.hit.push("[b]FIGHTING STAGE: " + battlefield.stage + " - " + "[/b]");
			outcome.hit.push( battlefield.fighters[battlefield.currentActor].name + " goes first!" );
			outcome.hint.push( battlefield.fighters[0].getStatBlock(), battlefield.fighters[1].getStatBlock() );
			battlefield.postOutcome(outcome);
			
			$( "#CombatResult" ).append( "<br />[url=http://www.f-list.net/c/rendezvous%20fight/]Visit this page for stage descriptions[/url]" );
		} else {
			//if there were error messages, print them to the error box instead of starting the game.
			$( "#ErrorResult" ).html( message_lines.join("<br />") );
		}
	});
	
	$( "#CombatInput" ).submit( function( event ) {
		event.preventDefault();
		var action = $( "input:radio[name=action]:checked" ).val();
		if(typeof action === 'undefined') return;
		
		var target = 1 - battlefield.currentActor; //Just a placeholder in case I add actual targeting of attacks and group fights later
		var roll = rollDice([20]);
		var outcome = { "damage" : 0, "hit" : [ ], "hint" : [ ] };
		
		if (roll > 2) {
			//Potential Hit
			switch (action) 
			{
			case "Light":
				outcome = battlefield.actionLight( battlefield.currentActor, target, roll );
				break;
			case "Heavy":
				outcome = battlefield.actionHeavy( battlefield.currentActor, target, roll );
				break;
			case "Grab":
				outcome = battlefield.actionGrab( battlefield.currentActor, target, roll );
				break;
			case "Damage/Rip Clothes":
				outcome = battlefield.actionRip( battlefield.currentActor, target, roll );
				break;
			case "Tackle":
				outcome = battlefield.actionTackle( battlefield.currentActor, target, roll );
				break;
			case "Magic/Ranged":
				outcome = battlefield.actionRanged( battlefield.currentActor, target, roll );
				break;
			case "Skip/Rest":
				outcome = battlefield.actionRest( battlefield.currentActor );
				break;
			case "Run Away":
				outcome = battlefield.actionRun( battlefield.currentActor, target );
				break;
			}
		} else {
			//Fumble
			outcome = battlefield.actionFumbled( battlefield.currentActor, action );
		}

		var statusMessages = battlefield.turnUpkeep();
		outcome.hit = outcome.hit.concat( statusMessages.hit );
		if(outcome.damage >= 25) outcome.hint.push("That was a strong hit!");

		battlefield.postOutcome(outcome, action, roll, statusMessages.special);
	});
});