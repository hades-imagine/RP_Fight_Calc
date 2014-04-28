-- Questions concerning the current development:

 - Should submission moves and Grappling crits do something more than just extra damage? Possibly a dizzy/disorientation effect?

 - For non casters, Intellect doesn't do terribly much at the moment... Any suggestions regarding additional effects Intellect might have? (Resisting goads and disorienting blows and such, or buffing defensive moves possibly?)

-- Possible future development:

 - An undo button is coming at some point, maybe. The hard part is making sure there's no way to abuse it. Possibly tie the results of each round a particular seed generated as the battle begins, so that undoing and redoing a turn will have the same results each time?

 - New moves? Guard/Defend, Distract, Goad, Riposte, Counter, etc. If you see something you'd like to be able to do, but don't have an option for under the current rules... let me know. 

 - Critical hits, Dodges, and other similar effects could potentially open up the possibility of follow-up attacks (Counters and the like) that can only be used after a successful dodge or critical, but have greatly increased effects.

 - Stage specific hazards/bonuses?


-----------  Patch Notes  -----------------
v.0.9.5.3 (April 28th, 2014):
Last quick balance change, hopefully. 
  - When grappling someone, neither you nor the target will be able to dodge attacks.
  - The stat reduction from grapple has been considerably reduced.
  - The difficulty of submission moves has been increased slightly, and the difficulty of grabbing someone back is no longer increased.
  - The cost of using grab successfully has increased (20 stamina rather than 15), though the total cost on a miss, dodge, or fumble remains unchanged.
  - The effects of willpower on the difficulty of Rest, Focus, and Channel have been increased.

v.0.9.5.2 (April 27th, 2014):
Another quick balance fix to hold things together until the next major patch.
  - Light and Heavy attacks are much less difficult to use while restrained/grappled now. Submission moves now inflict a dizzy/disorient effect though, so it is still in your best interests to try and take control of the grapple if someone gets ahold of you.
  - Slapped a really kludgey patch on some iffy conditional logic in how grapples work. The fix should resolve an issue where someone who was grappling their foe could escape the grapple and then immediately ALSO escape from melee... but it's not exactly an elegant fix. Good enough until the next big patch though, which will be reorganizing that code anyway.
  
v.0.9.5.1 (April 27th, 2014):
Just a few quick changes this time to shore up the balance of things while I work on the next big patch (v.0.9.6), which should be the last major change/addition to the mechanics. After 0.9.6 is in and stable, I'm going to be working on the UI, then adding a save/undo feature (some of the backend for that is already in the works, but I want to make very sure that it works perfectly before exposing it in the UI), and when I'm relatively certain all the bugs have been ironed out and the system is stable-- taking things out of testing (v 1.0). After that, I'll look at adding extra features as I find time, things like stage specific hazards/bonuses... more options for character customization/theming/specialties... etc.
  - Crits and glancing hits with magic attacks should cost the appropriate amount of mana now. Misses, fumbles, and dodges still have a reduced cost.
  - Ranged attacks should no longer crit quite as hard or be quite as accurate.
  - Being 'out of melee/evading' will no longer make melee attacks impossible, it will instead reduce their damage/effects and make them considerably more difficult (on par with the added difficulty for ranged attacks and magic when being grappled). Grappling someone, or damaging/ripping their clothing, will still be impossible until you catch up to them. Landing a melee attack against someone who is evading you will NOT drop you back into melee, it just represents you finding a chance to land a single attack before they get away once more. You will still need to charge or pursue someone to pull them back into melee semi-permanently.
  - While evading pursuit/staying out of melee, your normal stamina regen will no longer function, and if you stop to rest, you will drop back into melee afterward. You may also reenter melee at any time by using tackle (at the normal cost), or using escape again to abandon the chase without stamina cost.

v.0.9.5 (April 25th, 2014):
-- Changes to existing mechanics:
  - Okay, those regeneration messages got a bit too verbose... going to remove them and add a more intuitive system, showing the change in HP/Mana/Stamina/Cloth in the fighter status block each turn. Added bonus, this system should automatically show the total changes from all sources to all four stats, with no need to add any message handling to new moves down the line.
  - Fixed addMana, addStamina, and all the rest so that there should no longer be any issue with passing a non-whole number value to the function. I should have done this in the first place, and half the errors in the last few versions could have been avoided.  
       
v.0.9.4.2 Hotfix (April 25th, 2014):
-- Bug Fixes:
 - Fumbling when attempting to Escape was inadvertenly costing mana, not stamina. This has been corrected.
 - Stamina/Mana regen were breaking in some situations because the addMana and addStamina function were expecting integers, not float, and I forgot to round a couple values off. This has been corrected.
 - While I was at it, you now only regen on YOUR turn, but regen twice as much. The total amounts regenerated remain unchanged, but should be more obvious.
 - There is now a message showing how much each fighter regenerated on their turn.

v.0.9.4.1 Hotfix (April 24th, 2014):
-- Bug Fixes:
 - The bonus HP and Mana from rest are now ACTUALLY being applied to the appropriate totals.
 - The base stamina/mana regen is no longer quite so increased... that went a bit too far.
 - Removed some innocuous console.log messages that were just meant for testing.
 - The default value of cloth was changed slightly, no more automatic nudity if you forget to set it to something custom.
 
v.0.9.4 (April 24th, 2014):
-- Changes to existing mechanics:
 - The base stamina/mana regen have increased slightly. At 1 Endurance/Willpower, fighters should now regen 4 points per turn, and at 10 they should regen 8.
 - Rest once again restores a moderate amount of HP and Mana.
 - The mana gained from channel can now exceed your maximum normal mana, but mana beyond the normal cap will decay over time.

v.0.9.3.4 hotfix (April 23rd, 2014):
-- Changes to existing mechanics:
 - It is no longer possible to crit when you try and use a move you do not have sufficient stamina or mana to use at full capacity.


v.0.9.3.3 hotfix (April 23rd, 2014):
-- Bug Fixes:
 - The tooltip for ranged attacks has been changed to properly reflect the fact that they cost *stamina*, not mana.

-- Changes to existing mechanics:
 - Channel is now considerably more effective at converting stamina into mana. Mages shoud no longer have to channel quite as often.
 - Ranged attacks deal slightly more damage.

v.0.9.3.2 hotfix (April 23rd, 2014):
-- Bug fixes:
 - Initial hp and mana should immediately recalculate when the page is refreshed now, instead of staying at the default values until either endurance or willpower is changed.
 - Fixed bbCode output no longer updating properly in some circumstances (hopefully).
 - Fixed a bug where Escape followed by Pursuit was leaving one combatant in melee and one not in melee.
 - Altered the attack formula to make things more intuitive (higher rolls will crit now, lower rolls will allow the target to dodge, instead of having two separate rolls... one of which was hidden.)
 - Altered the damage formula slightly on most attacks so that criticals wouldn't take the base roll into account when adding bonus damage (since criticals will now only happen on high rolls, that would have increased the average damage of criticals quite a bit). To compensate, Dexterity now slightly increases your odds of hitting (on par with the effects of dodge, but in reverse).
 - Clarified lots of attack messages so that it should be more obvious what is causing things to happen.
 - Fixed a couple places where the attacker's name and target's name were reversed in attack messages.

-- Changes to existing mechanics:
 - Aim/Focus now has a chance of breaking if your stamina gets too low, and will definitely break if your stamina falls to 0 at any point.

v.0.9.3.1 hotfix (April 22nd, 2014):
-- Bug fixes:
 - Mana is properly calculated form Willpower now, not Intellect.
 - Dizzy and KO'd are firing properly. (Doh! Used Math.min instead of Math.max to test something...)
 - More helpful status messages for grappled, aiming, etc.

v.0.9.3 (April 22nd, 2014):
-- Bug fixes:
 - Some moves were inadvertently dealing damage or having some effects even when they missed. This has been fixed.
 - Some damage values were being ignored when they were not a whole number, that is no longer the case. Damage properly rounds down to the nearest whole number now.

-- Changes to existing mechanics:
 - Fumble: Fumbles are much less common. (1 in 20 now, as opposed to 1 in 10).

 - Dexterity: The effects of dexterity have been altered. Instead of increasing your odds of hitting/dodging attacks by adding/subtracting from the attack roll directly (which often became unbalanced at the extreme low and high end), dexterity now gives you a chance of converting an already successful attack into a critical blow (dealing additional damage or having some special additional effect, depending on the attack), or dodging/reducing the effect of an otherwise successful attack directed your way. At 10 Dexterity, these effects roughly equate to a 50% increase in damage dealt (from criticals), and a 50% decrease in damage taken (from dodges and glancing blows). 

 - Intellect: Intellect no longer affects the threshold at which you become disoriented/dizzy, instead, Willpower has a similar (but larger) effect.

 - Willpower: The effects of willpower have been altered. Willpower still determines your starting mana, but no longer adds mana or hp to the effects of Rest. Instead, willpower allows you to regenerate a small amount of mana each turn (in a manner similar to Endurance with stamina), lowers the threshold at which you are knocked out/dizzy (by 20 points at 10 Willpower), and affects your chances of successfully using Rest. Willpower also plays a key role in two new actions-- Channel (which lets you convert stamina into mana) and Aim/Focus (which lets you increase the accuracy of your attacks so long as you can maintain your focus).

 - Heavy attacks are slightly more accurate than before, but are still far from perfectly accurate.

 - Grappling: The stamina cost of Grab has been slightly reduced (35 instead of 40) to bring it inline with heavy attacks (and avoid situations where a combatant might have to rest twice just to recover from the effects of a single missed grab.) Grab no longer damages the target's mana. Instead, the distraction of being grappled greatly increases the difficulty of successfully using most actions, including magic and ranged attacks. 

   If you are being grappled, you no longer use Grab to escape (Escape is its own move now). Using grab will now allow you to try and take control of the grapple by grabbing your opponent instead of escaping.

   If you are grappling your foe...
     Using Grab successfully will deal extra damage and count as a Submission hold.
     Using Tackle (Throw) will automatically free them from your grapple.

   If your foe is grappling you...
     Using Grab successfully will allow you to grapple them as well.
     Using Escape successfully will break any hold your foe may have on you.
     Using Tackle (Throw) successfully will break any hold your foe may have on you.

   If you are both grappling each other...
     Using Grab successfully will deal extra damage and count as a Submission hold, and break any hold your foe may have on you.
     Using Escape successfully will break any hold your foe may have on you.
     Using Tackle (Throw) successfully will break any hold your foe may have on you, but will also break your hold on them.

 - Magic Attacks: The mana cost of magic attacks has been increased (30 mana now), but the stamina cost has been eliminated. Attampting to cast without sufficient mana will no longer cause the attack to fizzle, instead the attack will deal reduced damage in the same fashion as physical attacks taken with too little stamina. Magic attacks are also much less accurate now (on par with heavy attacks, tackles, and grabs) unless the time is taken to Aim/Focus first, which returns them to their original accuracy.

 - Tackle: The stamina damage from tackle has been lowered slightly (30). Tackle now also works as a charge when your opponent is outside of melee range, but costs additional stamina when used in this manner.

-- New mechanics:
 - Aim/Focus: Aiming/Focusing costs you a turn, but increases the accuracy of many attacks considerably as long as you remain focused/aimed. Each time you take damage from an attack, your focus will slip a bit, and eventually you will lose your focus entirely and have to use Aim/Focus again to regain it.

 - Channel: Channel helps you regain mana at the cost of stamina. The exact amount of mana regained (and stamina lost) is based on the roll and your Willpower. Roleplay wise, this could easily be described as something else entirely for those that prefer to use the magic attack, but aren't actually magic users... setting traps, preparing special poisons or charging up an attack... don't feel too constricted by the mechanics.

 - Escape/Pursue: Run has been replaced by Escape/Pursue, which does the following. If you are being grappled, Escape/Pursue will let you attempt to break free. When you are not grappling, escape will open up some distance between you and your opponent, forcing them to pursue you or try to tackle you if they want to use melee attacks. When your opponent is at a distance, Escape/Pursue will let you pursue them, trying to force them back into melee.

 - Ranged Attacks: A new type of attack has been added, the Ranged attack. This attack is stamina efficient, and deals moderate damage based on either Dexterity or Intelligence (whichever is higher), but is only so-so in terms of accuracy unless you take the time to Aim/Focus first.
