/**
 * Regression du moteur sur les 22 dilemmes reels.
 *
 * Le critere n'est pas « l'oracle est-il d'accord avec ce qui a ete fait »
 * mais « l'oracle est-il d'accord avec ce qui AURAIT DU etre fait », lu dans
 * les colonnes Satisfaction et Commentaire. Sur les cas notes 'bad', un
 * desaccord avec le choix reel est donc un SUCCES.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { consulter, evaluerOption, pileOuFace, estComplet, enjeuDe } from '../js/oracle.js';
import { composerVerdict } from '../js/phrases.js';
import { HISTORIQUE } from '../data/historique.js';

const nomDe = (d, i) => d.options[i]?.nom;

test('les 22 dilemmes reels produisent tous un verdict exploitable', () => {
  for (const d of HISTORIQUE) {
    const v = consulter(d);
    assert.ok(v, `verdict manquant pour ${d.date}`);
    assert.ok(v.classement.length >= 2);
    assert.ok(['TETE', 'SERRE', 'PILE_OU_FACE'].includes(v.type));
    assert.ok(composerVerdict(v).length > 0, 'verdict sans aucune replique');
  }
});

for (const [i, d] of HISTORIQUE.entries()) {
  if (!d.attendu) continue;
  const etiquette = `${d.date} — ${d.options.map((o) => o.nom).join(' / ')}`;

  test(`[${i}] ${etiquette}`, () => {
    const v = consulter(d);

    if (d.attendu.gagnant !== undefined) {
      assert.equal(
        v.gagnant.nom,
        nomDe(d, d.attendu.gagnant),
        `attendu « ${nomDe(d, d.attendu.gagnant)} », obtenu « ${v.gagnant.nom} » ` +
          `(${v.classement.map((o) => `${o.nom}:${o.total}`).join(' / ')})`
      );
    }
    if (d.attendu.pasGagnant !== undefined) {
      assert.notEqual(v.gagnant.nom, nomDe(d, d.attendu.pasGagnant));
    }
    if (d.attendu.type) {
      assert.equal(v.type, d.attendu.type, `type ${v.type}, attendu ${d.attendu.type}`);
    }
    if (d.attendu.drapeau) {
      assert.ok(
        v.drapeaux.includes(d.attendu.drapeau),
        `drapeau « ${d.attendu.drapeau} » absent (leves : ${v.drapeaux.join(', ') || 'aucun'})`
      );
    }
  });
}

test("sur les cas regrettes, l'oracle contredit bien le choix reel", () => {
  const rates = HISTORIQUE.filter((d) => d.reel.satisfaction === 'bad');
  assert.ok(rates.length >= 3, 'jeu de test trop maigre');
  for (const d of rates) {
    const v = consulter(d);
    const suitLeChoixRegrette = v.gagnant.nom === d.reel.choixFinal && v.type === 'TETE';
    assert.ok(
      !suitLeChoixRegrette,
      `${d.date} : l'oracle recommande fermement « ${v.gagnant.nom} », qui a ete regrette`
    );
  }
});

test('Q0 redistribue les poids sans jamais marquer de points', () => {
  const base = {
    options: [
      { nom: 'Faire le truc qui fait peur', q1: 'peur', q2: 'nourrit', q3: 'rate' },
      { nom: 'Rester tranquille', q1: 'elan', q2: 'bon', q3: 'rien' },
    ],
  };
  const leger = consulter({ ...base, q0: 'non' });
  const lourd = consulter({ ...base, q0: 'oui' });

  assert.equal(enjeuDe('non'), 'leger');
  assert.equal(enjeuDe(undefined), 'moyen');
  // Quand ca compte, le regret l'emporte sur l'envie du moment.
  assert.equal(lourd.gagnant.nom, 'Faire le truc qui fait peur');
  // L'ecart doit se resserrer quand ca ne compte pas.
  assert.ok(lourd.ecart > leger.ecart, 'Q0 devrait changer la fermete du verdict');
});

test('une peur suivie de soulagement est penalisee, pas recompensee', () => {
  const option = { nom: 'x', q1: 'peur', q2: 'change', q3: 'soulage' };
  const e = evaluerOption(option, 'moyen');
  assert.ok(e.detail.bonus.some((b) => b.cle === 'peurQuiProtege'));
  assert.ok(!e.detail.bonus.some((b) => b.cle === 'peurQuiCompte'));
});

test('une parole donnee passe devant une envie plus forte', () => {
  const sansParole = consulter({
    q0: 'bof',
    options: [
      { nom: 'Le rendez-vous', q1: 'bof', q2: 'petit', q3: 'frustre' },
      { nom: 'Dessiner chez moi', q1: 'elan', q2: 'nourrit', q3: 'rien' },
    ],
  });
  const avecParole = consulter({
    q0: 'bof',
    options: [
      { nom: 'Le rendez-vous', q1: 'bof', q2: 'petit', q3: 'frustre', engagement: true },
      { nom: 'Dessiner chez moi', q1: 'elan', q2: 'nourrit', q3: 'rien' },
    ],
  });
  assert.equal(sansParole.gagnant.nom, 'Dessiner chez moi');
  assert.equal(avecParole.gagnant.nom, 'Le rendez-vous');
  assert.ok(avecParole.drapeaux.includes('engagement'));
});

test("l'oracle propose une option C quand rien n'appelle", () => {
  const v = consulter({
    q0: 'bof',
    options: [
      { nom: 'Sortir', q1: 'flemme', q2: 'bon', q3: 'reporte' },
      { nom: 'Autre sortie', q1: 'peur', q2: 'petit', q3: 'rien' },
    ],
  });
  assert.ok(v.drapeaux.includes('aucuneNAppelle'));
  const dit = composerVerdict(v).map((l) => l.texte).join(' ');
  assert.match(dit, /troisième|ne rien faire|option C/i);
});

test('une grosse decision est nommee avant d etre tranchee', () => {
  // Le dilemme Inde / Asturias, tel qu'il serait pose aujourd'hui avec Q0.
  const inde = HISTORIQUE.find((d) => d.options[0].nom.startsWith("Annuler l'Inde"));
  const v = consulter({ ...inde, q0: 'oui' });
  assert.ok(v.drapeaux.includes('grandeDecision'));
  const lignes = composerVerdict(v);
  assert.equal(lignes[0].ton, 'mise-en-garde', 'la mise en garde doit venir en premier');
  assert.ok(lignes.some((l) => l.ton === 'verdict' || l.ton === 'oracle'));
});

test('le pile ou face ne tire que parmi les ex aequo', () => {
  const v = consulter({
    q0: 'non',
    options: [
      { nom: 'A', q1: 'partant', q2: 'bon', q3: 'rien' },
      { nom: 'B', q1: 'partant', q2: 'bon', q3: 'rien' },
      { nom: 'C', q1: 'flemme', q2: 'rien', q3: 'soulage' },
    ],
  });
  assert.equal(v.type, 'PILE_OU_FACE');
  for (const a of [0, 0.49, 0.99]) {
    assert.notEqual(pileOuFace(v, () => a).nom, 'C', 'C ne devrait jamais sortir');
  }
});

test('un dilemme incomplet ne consulte pas', () => {
  assert.equal(consulter({ q0: 'oui', options: [{ nom: 'seule' }] }), null);
  assert.equal(estComplet({ q0: 'oui', options: [{ nom: 'a', q1: 'bof', q2: 'bon', q3: 'rien' }] }), false);
  assert.equal(
    estComplet({
      q0: 'oui',
      options: [
        { nom: 'a', q1: 'bof', q2: 'bon', q3: 'rien' },
        { nom: 'b', q1: 'elan', q2: 'bon', q3: 'rien' },
      ],
    }),
    true
  );
});
