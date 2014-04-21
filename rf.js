BBParser = function () {
	var a = {};
	a._urlregex = /^\s*((?:https?|ftps?|irc):\/\/[^\s\/$.?#"'].[^\s]*)\s*$/;
	a.validateURL = function (g) {
		return a._urlregex.test(g)
	};
	a.unescapeURL = function (g) {
		g.replace('"', "&quot;");
		g.replace("'", "&#39;");
		g.replace("<", "&lt;");
		g.replace(">", "&gt;");
		var k = document.createElement("div");
		k.innerHTML = g;
		return k.textContent
	};
	var b = {
		noparse: {
			render: function (g) {
				return g
			},
			allowed: false
		},
		b: {
			opentag: "strong",
			closetag: "strong",
			allowed: true
		},
		i: {
			opentag: "em",
			closetag: "em",
			allowed: true
		},
		u: {
			opentag: 'span style="text-decoration:underline;"',
			closetag: "span",
			allowed: true
		},
		s: {
			opentag: "del",
			closetag: "del",
			allowed: true
		},
		sub: {
			opentag: "sub",
			closetag: "sub",
			allowed: ["b", "i", "u"]
		},
		sup: {
			opentag: "sup",
			closetag: "sup",
			allowed: ["b", "i", "u"]
		},
		url: {
			render: function (g, k) {
				if (typeof g == undefined || g.length == 0) {
					g = k;
					k = undefined
				}
				if (typeof k != "undefined") {
					k = k.replace(/ /g, "%20");
					if (a.validateURL(k) && !a.validateURL(g)) {
						var l = a._urlregex.exec(k),
							m = l[1].match(/(https?|ftps?|irc):\/\/(?:www.)?([^\/]+)/)[2],
							p = document.createElement("div"),
							q = document.createElement("a");
						q.href = a.unescapeURL(l[1]);
						q.className = "ParsedLink ImageLink";
						q.target = "_blank";
						q.textContent = g.replace(/&amp;/g, "&");
						p.appendChild(q);
						return p.innerHTML + ' <span style="font-size: 0.8em;">[' + m + "]</span>"
					} else return "[bad url: " + k + "] " + g
				} else if (a.validateURL(g)) {
					l = a._urlregex.exec(g);
					p = document.createElement("div");
					q = document.createElement("a");
					q.href = a.unescapeURL(l[1]);
					q.className = "ParsedLink ImageLink";
					q.target = "_blank";
					q.textContent = l[1];
					p.appendChild(q);
					return p.innerHTML
				} else return "[bad url: " +
					g + "] "
			},
			allowed: false
		},
		color: {
			render: function (g, k) {
				return '<span style="color:' + k + ';">' + g + "</span>"
			},
			allowed: true
		}
	}, c = null,
		d = null,
		e = false,
		f = null,
		h = /(\[[\[ \/]*)([^\[\]]+)([\] ]*\])/,
		n = false,
		o = "Text cut: too long.",
		t = function (g, k) {
			for (var l = 0; l < k.length; l++)
				if (k[l] == g) return true;
			return false
		}, x = function (g, k) {
			if (!b[k]) return true;
			k = b[k].allowed;
			if (g == true && k == true) return true;
			if (typeof k == "undefined") return g;
			if (g == false) return false;
			for (var l = [], m = 0; m < k.length; m++)
				if (g == true || t(g, k[m])) l.push(k[m]);
			return l.length == 0 ? false : l
		}, v = function (g, k, l) {
			if (g instanceof Array) {
				k = "";
				for (var m = 0; m < g.length; m++) k += v(g[m], l, x(l, g[m].tagname));
				return k
			}
			if (g.tagname == "text") {
				if (n && /\w{50,}/.test(c.substring(g.start, g.end))) return o;
				return c.substring(g.start, g.end)
			}
			if (g.tagname && k != false && (k == true || t(g.tagname, k))) {
				m = b[g.tagname];
				if (!g.content) return "";
				k = v(g.content, k, l);
				return typeof m.render == "function" ? m.render(k, g.attribute) : "<" + m.opentag + ">" + k + "</" + m.closetag + ">"
			} else e && g.tagname && f.push("The [" + g.tagname +
				"] tag is not allowed here: " + c.substr(g.start, 60) + "...");
			return c.substring(g.start, g.end)
		}, w = function (g, k, l) {
			for (var m = 0; m < g.length; m++) {
				if (g[m].tagname == "text") {
					if (m == 0) g[m].start = k;
					if (m == g.length - 1) g[m].end = l
				}
				if (m > 0 && g[m - 1].tagname == "text") g[m - 1].end = g[m].start
			}
		}, u = function (g, k, l, m) {
			if (g != null) {
				var p = g.openstart,
					q = g.openend;
				if (g.tagname == "noparse") {
					var r = "[/noparse]";
					q = c.substring(g.openend, l).indexOf(r);
					if (q > -1) q += g.openend + 10;
					else q = l;
					return {
						tagname: "noparse",
						start: g.openstart,
						end: q,
						content: [{
							tagname: "text",
							start: g.openstart + 9,
							end: q - 10
						}]
					}
				}
				p = {
					tagname: g.tagname,
					attribute: g.attribute,
					start: g.openstart
				};
				m = u(null, q + 1, l, m + 1);
				k = m[m.length - 1].end;
				r = "[/";
				r = c.substring(k, l).indexOf(r);
				if (r > -1) r += k;
				var s = c.substring(r, l).indexOf("]");
				if (s > -1) s += r;
				var y = c.substring(r + 2, s);
				if (r > -1 && y == g.tagname) {
					p.end = s + 1;
					p.content = m
				} else {
					if (e) c.substring(k, l).indexOf("[/" + g.tagname) == -1 ? f.push("Open [" + g.tagname + "] tag is not properly closed (with [/" + g.tagname + "]).") : f.push("Bad BBCode in [" + g.tagname + "] tag, somewhere around/after '" +
						c.substr(q + 1, 50) + "...'.");
					p.tagname = "text";
					p.end = r == -1 || s == -1 ? l : s + 1
				}
				w(m, q + 1, r);
				p.content = m;
				return p
			} else {
				p = c.substring(k, l).indexOf("[");
				if (p > -1) p += k;
				q = c.substring(p, l).indexOf("]");
				if (q > -1) q += p;
				r = null;
				if (p > -1 && q > -1) {
					g = c.substring(p + 1, q).match(/^([a-z]+)(?:=([^\]]+))?/i);
					if (g != null) {
						r = g[1].toLowerCase();
						if (b[r]) {
							r = {
								tagname: r
							};
							if (g[2]) r.attribute = g[2];
							r = r
						} else {
							e && f.push("This looks like a bbcode tag, but isn't one: [" + r + "]");
							r = null
						}
					} else r = null
				} else return [{
					tagname: "text",
					start: k,
					end: k
				}]; if (r == null) return [{
					tagname: "text",
					start: k,
					end: k
				}];
				g = [];
				if (k < p) {
					k = u(null, k, p, m + 1);
					for (s = 0; s < k.length; s++) g.push(k[s])
				}
				r.openstart = p;
				r.openend = q;
				p = u(r, q, l, m + 1, true);
				g.push(p);
				if (p.end < l) {
					k = u(null, p.end, l, m + 1);
					for (s = 0; s < k.length; s++) g.push(k[s])
				}
				return g
			}
		};
		
	return {
		Util: a,
		parseBB: function (g) {
			if (e) f = [];
			for (var k = g.replace(/\[\]/g, "&#91;&#93;"), l = 1, m = 0; l !== null;) {
				l = h.exec(k.substr(m));
				if (l !== null) {
					if (l[2].indexOf("=") != -1) l[2] = l[2].slice(0, l[2].indexOf("="));
					if (l[1] != "[" && l[1] != "[/" || l[3] != "]" || !b[l[2]]) {
						var p = l[0].replace(/\[/g, "&#91;").replace(/\]/g,
							"&#93;");
						k = k.slice(0, m + l.index) + p + k.slice(m + l.index + l[0].length);
						m = m + l.index + p.length
					} else m += l[0].length
				}
			}
			c = k;
			d = u(null, 0, c.length, 0);
			w(d, 0, c.length);
			k = v(d, true, true);
			if (k.length == 0 && g.length > 0) {
				g = g;
				f.push("Toplevel tag structure errors found. Check your out-most tags.")
			} else g = k; if (e && f.length > 0) {
				k = '<div style="border: 2px solid yellow; padding: 3px; background: #600; color: white; margin-bottom: 1.5em;">Warning: The BBCode parser has found errors in your code.<ul style="margin-top: 0.5em; margin-bottom: 0.5em; padding-left: 1em; margin-left: 0.5em; list-style-type: square;">';
				for (var q in f) k += "<li>" + f[q].replace(/\n/g, "") + "</li>";
				k += "</ul></div>";
				g = k + g
			}
			d = c = null;
			return g
		},
		parseEmotes: function (g) {
			$.each(["hex-smile", "heart", "hex-yell", "hex-sad", "hex-grin", "hex-red", "hex-razz", "hex-twist", "hex-roll", "hex-mad", "hex-confuse", "hex-eek", "hex-wink", "lif-angry", "lif-blush", "lif-cry", "lif-evil", "lif-gasp", "lif-happy", "lif-meh", "lif-neutral", "lif-ooh", "lif-purr", "lif-roll", "lif-sad", "lif-sick", "lif-smile", "lif-whee", "lif-wink", "lif-wtf", "lif-yawn", "cake"], function (k, l) {
				g = g.replace(RegExp(":" +
					l + ":", "gim"), "<img src='http://f-list.com/images/smileys/" + l + ".png' alt='" + l + " emote' title=':" + l + ":' align='middle'/>")
			});
			return g
		},
		parseContent: function (g) {
			g = this.parseBB(g);
			if (/<br ?\/?>/.test(g) == false) g = "";
			return this.parseEmotes(g)
		},
		addCustomTag: function (g, k, l) {
			b[g] = {
				render: l,
				allowed: k
			}
		},
		addSimpleTag: function (g, k, l, m) {
			b[g] = {
				opentag: k,
				closetag: l,
				allowed: m
			}
		},
		enableWarnings: function () {
			e = true
		},
		replaceLongWordsWith: function (g) {
			n = true;
			o = g
		}
	}
};

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
		_rollovers : {
			"Strength" : "Strength. <br /> This is your base damage stat; the higher this is, the higher your basic attacks will be. This affects all attacks besides ranged, and also increases your chance of performing techniques like grab or tackle.",
			"Dexterity" : "Dexterity. <br /> This is your accuracy and dodge stat; the higher this is, the more likely you will hit and avoid being hit by basic attacks and techniques.",
			"Endurance" : "Endurance. <br /> This is your basic defense stat; the higher this is the more health you will have and the faster your stamina will refill over time.",
			"Intellect" : "Intellect. <br /> This is your ranged/magic AND magic resist stat; the higher this is, the more damage you will deal and the less damage you will take from ranged attacks. Also helps protect slightly against disorientation.",
			"Willpower" : "Willpower. <br /> This is your mana-pool stat; the higher this is, the more magic/ranged attacks you can perform. BE WARNED - You must have at least 2 wisdom to make a single ranged/magic attack.",
			"HP" : "Hit Points. <br />How much health you have initially.",
			"Mana" : "Mana. <br />How much mana you have initially.",
			"Stamina" : "Stamina. <br />How much stamina you have initially.",
			"Cloth" : "Cloth. <br />How durable your clothes are. <br />Typically, fighters start with 20 points of cloth per major item of clothing worn.",
			"StatPoints" : "Maximum Stat Points. <br /> The maximum number of points each fighter may have spread among their stats. Typically 20. If you wish to allow fighters to have any number of points in their stats (including uneven fights where one fighter has an advantage), set this value to 0.",
			"GameSpeed" : "Game speed. <br /> This value works as a multiplier to all damage. A value of 2, for example, would double damage. A value of 0.5 would halve damage. You may want to reduce it if you allow a higher than normal number of stat points (26-32 or more).",
			"DisorientedAt" : "Dizzy. <br /> If a fighter's HP falls too far below this value they will become disoriented and take a penalty to all their actions. Affected slightly by the fighters Intellect.",
			"UnconsciousAt" : "KO'd. <br />If a fighter's HP falls below this value they will be knocked out and become helpless.",
			"DeadAt" : "Dead. <br />If a fighter's HP falls below this value they will be killed.",
			"Light" : "Light attack (20 Stamina) <br />Punches, weak kicks, weak weapon uses and such. Deals some damage and also reduces the target's stamina. <br /> Strength adds to damage and affects the chance to hit. <br />Intelligence adds to stamina damage. <br />Dexterity affects defense.",
			"Heavy" : "Heavy attack (35 Stamina) <br />Heavy kicks, weapons, combos, etc. Harder to perform, but deal more damage. <br />Strength greatly affects damage and affects chance to hit.<br /> Dexterity affects defense. <br /><br /> Stamina cost: 35",
			"Grab" : "Grab (40/20 Stamina, 15 Stamina for Submission hold.) <br />Deals little damage initially. But once grabbed, the opponent is held until they manage to escape by using the Grab action as well. Light and Heavy attacks can be used in a grab, as well as Grab for a submission hold. Target has reduced strength and dexterity while grabbed. <br />Strength and Dexterity affect chance to hit. <br />Strength affects the damage of submission moves. <br />Dexterity affects defense. <br />Reduced stamina cost if successful.",
			"Rip" : "Rip/Damage Clothes (Free) <br />Does no HP damage, damaging clothes instead. Much greater effect when used in a grab. 1 piece of clothing equals 20 points. Keep that in mind. If you only have bikini on you, it is 40 points, for 2 pieces. You can use this stat anyway you like as well.",
			"Tackle" : "Tackle or Throw (40/20 Stamina) <br />Deals stamina damage and stuns the opponent, preventing them from taking their next action. (Effectively letting you perform another action). Tackle during Grab releases opponent. <br /> Strength and Dexterity affects chance to hit. <br />Dexterity greatly affects defense.  <br />Reduced stamina cost if successful.",
			"Ranged" : "Magic or ranged attack (10 Stamina, 15 Mana) <br />Intelligence greatly affects damage. <br />Willpower affects the chance to hit and defense. <br /> Stamina cost: 10, Mana cost: 15",
			"Rest" : "Rest (Free) <br />Restores stamina, mana, and some health. <br /> Endurance affects stamina regained. <br />Wisdom affects mana and HP regained.",
			"Run" : "Run (Free) <br />Run away from your opponent. Consumes a little bit of stamina. Opponent can only attack you with ranged or magic attacks in the next move, or use rest. <br />Useless Action (currently)."
		},
		getRolloverKeys : function () {
			var keys = [];
			for(var key in this._rollovers) {
				if(this._rollovers.hasOwnProperty(key)) { //to be safe
					keys.push("[name='" + key + "']");
				}
			}
			return keys;
		},
		setToolTip : function ( key ) {
			$( "#HoverTip" ).html( this._rollovers[key] );
		},
		clearToolTip : function () {
			$( "#HoverTip" ).empty();
		},
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
			action : function (message) { return "Action: " + message + " "; },
			damage : function (message) {	return "[color=yellow]( Damage: " + message + " )[/color]"; },
			hit : function (message) { return "[color=red][b]" + message + "[/b][/color]"; },
			hint : function (message) { return "[color=purple]" + message + "[/color]"; },
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
				windowController.clearToolTip();
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
			var lines = [""];
			if( this.messages.action.length ) lines[0] += this._formatMessage.action( this.messages.action.join(" ") );
			if( this.messages.damage != 0 ) lines[0] += this._formatMessage.damage( this.messages.damage );
			if( lines[0] == "" ) lines = [];
			
			if( this.messages.hit.length ) lines.push( this._formatMessage.hit( this.messages.hit.join("<br />") ));
			if( this.messages.status.length ) lines.push( this.messages.status.join("<br /> ") );
			if( this.messages.hint.length ) lines.push( this._formatMessage.hint( this.messages.hint.join("<br />") ));			
			if( this.messages.special.length ) lines.push( this._formatMessage.special( this.messages.special.join("<br />") ));
			if( this.messages.info.length ) lines.push( "<br />" + this.messages.info.join("<br />") );
			$( "#CombatResult" ).html( lines.join("<br />"));

			//var tagParser = new BBParser();
			//$( "#ParsedOutput" ).html( tagParser.parseContent( $( "#CombatResult" ).html() ));
			
			$( "#ErrorMessage" ).empty();
			if( this.messages.error.length ) $( "#ErrorMessage" ).append( this.messages.error.join("<br />") );		

			//clear messages from the queue once they have been displayed
			this.messages = {
				action : [],
				hit : [],
				damage : 0,
				status : [],
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
		setDamage : function( damage ) { this.messages.damage = Math.floor(damage); },
		addHint : function( line ) { if( typeof line === "string" ) this.messages.hint.push(line); },
		addSpecial : function( line ) { if( typeof line === "string" ) this.messages.special.push(line); },
		addInfo : function( line ) { if( typeof line === "string" ) this.messages.info.push(line); },
		addError : function( line ) { if( typeof line === "string" ) this.messages.error.push(line); },
		calcFormHP : function ( target ) {
			var hp = 0;
			if( parseInt(target.value) == target.value ) hp = (target.value * 10) + 60;
			$(target).siblings("input[name=HP]").val(hp);
			$(target).siblings("span[name=maxHP]").html(hp);
		},
		calcFormMana : function ( target ) {
			var mana = 0;
			if( parseInt(target.value) == target.value ) mana = (target.value * 10);
			$(target).siblings("input[name=Mana]").val(mana);
			$(target).siblings("span[name=maxMana]").html(mana);
		},
	};
	
	function arena(){
		if (!(this instanceof arena)) return new arena(); //protection against calling this as a function rather than instantiating it with new.
		this._fighters = [];	
		this._currentFighter;
		this.stage = this.pickStage();
		
		//Set default values for global settings
		this._globalFighterSettings = { "GameSpeed" : 1, "StatPoints" : 20, "DeadAt" : 0, "UnconsciousAt" : 25, "DisorientedAt" : 40 };
	};
	
	arena.prototype = {
		setGlobalFighterSettings : function ( settings ) {
			if(parseInt( settings.StatPoints ) == settings.StatPoints ) this._globalFighterSettings.StatPoints = settings.StatPoints;
			if(parseInt( settings.DeadAt ) == settings.DeadAt ) this._globalFighterSettings.DeadAt = Math.max(settings.DeadAt, 0);
			if(parseInt( settings.UnconsciousAt ) == settings.UnconsciousAt ) this._globalFighterSettings.UnconsciousAt = Math.max(settings.UnconsciousAt,  this._globalFighterSettings.DeadAt);
			if(parseInt( settings.DisorientedAt ) == settings.DisorientedAt ) this._globalFighterSettings.DisorientedAt = Math.max(settings.DisorientedAt,  this._globalFighterSettings.UnconsciousAt);
			if( !(isNaN(settings.GameSpeed)) ) this._globalFighterSettings.GameSpeed = settings.GameSpeed;
		},
		
		addFighter : function ( settings ) {
			try {
				this._fighters.push( new fighter(settings, this._globalFighterSettings) ); 
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
			for (var i = 0, len = this._fighters.length; i < len; i++) windowController.addStatus( this._fighters[i].getStatus() );
		},
		
		outputFighterStats : function () {
			for (var i = 0, len = this._fighters.length; i < len; i++) windowController.addStatus( this._fighters[i].getStatBlock() );
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

	function fighter(settings, globalSettings){
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

		this._dizzyValue = globalSettings.DisorientedAt - this._intellect;
		this._koValue = globalSettings.UnconsciousAt;
		this._deathValue = globalSettings.DeadAt;
		
		//Check stat points for conformity to rules
		if (this._strength > 10  || this._strength < 1) errors.push( settings.Name + "'s Strength is outside the allowed range (1 to 10).");		
		if (this._dexterity > 10 || this._dexterity < 1) errors.push( settings.Name + "'s Dexterity is outside the allowed range (1 to 10).");		
		if (this._endurance > 10 || this._endurance < 1) errors.push( settings.Name + "'s Endurance is outside the allowed range (1 to 10).");		
		if (this._intellect > 10 || this._intellect < 1) errors.push( settings.Name + "'s Intellect is outside the allowed range (1 to 10).");		
		if (this._willpower > 10 || this._willpower < 1) errors.push( settings.Name + "'s Willpower is outside the allowed range (1 to 10).");		
		
		var stattotal = this._strength + this._dexterity + this._endurance +  this._intellect +  this._willpower;
		if ( stattotal!= globalSettings.StatPoints && globalSettings.StatPoints != 0 )  errors.push( settings.Name + " has stats that are too high or too low (" + stattotal + " out of " + globalSettings.StatPoints + " points spent).");		

		if ( errors.length ) {
			for (var i = 0, len = errors.length; i < len; i++) windowController.addError( errors[i] );
			throw new Error( settings.Name + " was not created due to invalid settings." );
		}
		
		this._maxHP = 60 + this._endurance * 10;
		this._maxMana = this._intellect * 10;
		this._maxStamina = 100;
	
		this._damageEffectMult = globalSettings.GameSpeed;
		
		this.hp = 0;
		this.addHp( settings.HP );
		
		this.mana = 0;
		this.addMana( settings.Mana );
		
		this.stamina = 0;
		this.addStamina( settings.Stamina );
		
		this.cloth = 0;
		this.addCloth( settings.Cloth );
		
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
		
		addHp : function ( n ) { 
			if (parseInt(n) == n) this.hp += Math.floor( n ) * this._damageEffectMult;
			this.hp = clamp(this.hp, 0, this._maxHP);
		},
		
		addMana : function ( n ) { 
			if (parseInt(n) == n) this.mana += Math.floor( n );
			this.mana = clamp(this.mana, 0, this._maxMana);
		},
		
		addStamina : function ( n ) { 
			if (parseInt(n) == n) this.stamina += Math.floor( n );
			this.stamina = clamp(this.stamina, 0, this._maxStamina);
		},
		
		addCloth : function ( n ) { 
			if (parseInt(n) == n) this.cloth += Math.floor( n );
			this.cloth = Math.max(this.cloth, 0);
		},
		
		hitHp : function ( n ) { 
			if (parseInt(n) == n) {
				var x = Math.floor( n )  * this._damageEffectMult;
				this.hp -= x;
				this.hp = clamp(this.hp, 0, this._maxHP);
				windowController.setDamage(x);
			}
		},
		
		hitMana : function ( n ) { 
			if (parseInt(n) == n) this.mana -= Math.floor( n );
			this.mana = clamp(this.mana, 0, this._maxMana);
		},
		
		hitStamina : function ( n ) { 
			if (parseInt(n) == n) this.stamina -= Math.floor( n );
			this.stamina = clamp(this.stamina, 0, this._maxStamina);
		},
		
		hitCloth : function ( n ) { 
			if (parseInt(n) == n) this.cloth -= Math.floor( n )  * this._damageEffectMult;
			this.cloth = Math.max(this.cloth, 0);
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
				this.addMana(3);
				this.addStamina(this.endurance() / 2);
			} else {
				this.isStunned = true;
			}
		},
		
		getStatBlock : function () {
			return "[color=purple]" + this.name + " stats: Strength:" + this.strength() + " Dexterity:" + this.dexterity() + " Endurance:" + this.endurance() + " Intellect:" + this.intellect() + " Willpower:" + this.willpower() + "[/color]";
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
				target.hitCloth(3);
			} else {
				windowController.addHit( " DODGE! " );
				windowController.addHint( target.name + " dodged the attack!" );
			}

			attacker.hitStamina (requiredStam);
			target.hitStamina (damage + attacker.intellect());
			target.hitHp(damage);
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
				target.hitCloth(5);
			} else {
				windowController.addHit( " DODGE! " );
				windowController.addHint( target.name + " dodged the attack!" );
			}

			attacker.hitStamina (requiredStam);	
			target.hitHp(damage);
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
					windowController.addHit( attacker.name + " ESCAPED " + target.name + "'s HOLD! " + target.name + " can not use GRAB in next move!" );
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
				target.hitCloth(4);
			} else {
				windowController.addHit( " FAILED! " );
				windowController.addHint( target.name + " resisted the grab attempt!" );
			}

			attacker.addStamina(bonusStam);
			attacker.hitStamina(requiredStam);	
			target.hitMana(manaDamage);
			target.hitHp(damage);
		},
		
		actionRip : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
				
			if ( attacker.isGrappling( target ) ) {
				target.hitCloth( roll * 2 );
				windowController.addHit( attacker.name + " rips " + target.name + "'s clothes in a grab!" );
			} else {
				target.hitCloth( roll );
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
				target.hitStamina(40);
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

			attacker.addStamina(bonusStam);
			attacker.hitStamina(requiredStam);
			target.hitHp(damage);
		},
		
		actionRanged : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			var damage = 0;	
			var requiredStam = 15;
			var requiredMana = 15;	
			var difficulty = 4;
			
			if (attacker.mana < requiredMana) {
				attacker.hitMana(requiredMana);
				windowController.addHit( "CRITICAL MISS! " );
				windowController.addHint( "TIP: YOU NEED MORE MANA FOR MAGIC/RANGED ATTACKS (15 AT LEAST)!" );
			} else if ((roll + attacker.willpower() - target.willpower() > difficulty))	{
				damage = (roll/2) + (3 * attacker.intellect()) - target.intellect();
				if ( attacker.stamina < requiredStam )
				{
					damage = damage * (attacker.stamina / requiredStam);
					windowController.addHit( " Glancing Hit! " );
					windowController.addHint( attacker.name + " was too tired to deal full damage!" );
				} else {
					windowController.addHit( " RANGED/MAGIC HIT! " );
				}

				damage = Math.max(damage, 1);
				attacker.hitStamina(requiredStam);
				attacker.hitMana(requiredMana);
			} else {
				windowController.addHint( "MISS! " );
			}

			target.hitHp(damage);
		},
		
		actionRest : function ( roll ) {
			var attacker = this;
			
			attacker.addStamina(30 + attacker.endurance() * 2);
			attacker.addHp(attacker.willpower());
			attacker.addMana(attacker.willpower());
			windowController.addHit( attacker.name + " SKIPS MOVE, RESTING!" );
			windowController.addHint( attacker.name + " recovered. Stamina:" + (30 + attacker.endurance() * 2) + " | HP:" + attacker.willpower() + " | Mana:" + attacker.willpower() );
		},
		
		actionRun : function ( roll ) {
			var attacker = this;
			var target = battlefield.getTarget();
			
			if (attacker.stamina >= 20)
			{
				windowController.addHint( attacker.name + " runs, increasing distance from" + target.name + ". " + target.name + " can only use ranged attacks or rest in the next move!");   
			} else {
				windowController.addHint( attacker.name + " is exhausted and can't run from  " + target.name + ". " );
			}
			
			attacker.hitStamina(20);
		},

		actionFumble : function ( action ) {
			var attacker = this;
			
			switch (action) 
			{
			case "Light":
				attacker.hitStamina(15);
				break;
			case "Heavy":
				attacker.hitStamina(30);
				break;
			case "Grab":
				attacker.hitStamina(35);
				break;
			case "Tackle":
				attacker.hitStamina(35);
				break;
			case "Magic/Ranged":
				attacker.hitMana(10);
				attacker.hitStamina(5);
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
	
	// Catch any changes to Endurance or Intellect and alter the current/maximum HP or Mana to match.
	$( "fieldset[id^=Fighter]" ).each( function() {
		$(this).find("input[name=Endurance]").change( function( event ) {
			windowController.calcFormHP( this );
		});
		
		$(this).find("input[name=Intellect]").change( function( event ) {
			windowController.calcFormMana( this );
		});
	});
	
	// Mouseover tooltip events
	$( windowController.getRolloverKeys().join(", ") ).mouseenter(function() {
		windowController.setToolTip( $(this).attr("name") );
		// console.log( windowController.rollovers[$(this).attr("name")] );
	});
	
	// Take input from the setup form, add fighters to the arena, and then switch to the next panel.
	$( "#InitialSetup" ).submit( function( event ) {
		event.preventDefault();	
		
		var arenaSettings = {};
		$( "fieldset[id='Arena']" ).find("input").each(function() {
			arenaSettings[this.name] = $(this).val();
		});
		battlefield.setGlobalFighterSettings(arenaSettings);
//		console.dir( arenaSettings );
		
		battlefield.clearFighters();
		var fighterSettings = [ ];
		
		$( "fieldset[id^='Fighter']" ).each( function( index ) {
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
			windowController.addHit("FIGHTING STAGE: " + battlefield.stage + " - " + battlefield.getActor().name + " goes first!");
			battlefield.outputFighterStatus();
			battlefield.outputFighterStats();
			windowController.addInfo( "[url=http://www.f-list.net/c/rendezvous%20fight/]Visit this page for stage descriptions[/url]" );
		} 	
		
		windowController.updateOutput();
	});

	//Take input from the gameplay/combat form, provide the appropriate results, and run end of turn regen/cleanup.
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