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

-- In development/discussion:
 - An undo button is coming in the next patch, possibly. The hard part is making sure there's no way to abuse it. Possibly tie the results of each round a particular seed generated as the battle begins, so that undoing and redoing a turn will have the same results each time?

 - Critical hits, Dodges, and other similar effects could potentially open up the possibility of follow-up attacks (Counters and the like) that can only be used after a successful dodge or critical, but have greatly increased effects.

 - Willpower, does it need an additional bump in effectiveness? Possibly adding a resistance to the effects of some attacks, like submission holds?

 - Should the maximum mana and stamina be higher than the starting values? (allowing even low willpower characters to potentially use a magic attack occasionally, for example). Possibly with no actual maximum, just a decay over time when you've gone above your normal maximum?

 - New moves? Guard/Defend, Distract, Goad, Riposte, Counter, etc. If you see something you'd like to be able to do, but don't have an option for under the current rules... let me know.

 - Is the cost of heavy attacks too high, considering their accuracy? How about Magic attacks?

 - For non casters, Intellect doesn't do terribly much at the moment... I'd like to add some additional effects it might have (resisting goads and disorienting blows and such, or buffing defensive moves possibly?)