// Curated art-history dataset.
//
// Every image URL here was resolved through the Wikimedia Commons API and
// verified to return a real image, so nothing depends on a live API at runtime.
// Note: Commons only serves specific thumbnail widths per file, so these URLs
// are the exact ones the API issued — do not hand-edit the `NNNpx-` segment.
//
// Selection rule: each era leads with the single most recognisable work that is
// genuinely public domain. Some 20th-century icons (Dalí's Persistence of
// Memory, Picasso's Guernica and Demoiselles) are still under copyright and are
// unavailable from Commons, the Met, and the Art Institute alike — so the Modern
// era is built around Munch, Klimt, Mondrian and Hopper, whose defining works
// are both free and famous, rather than around weaker substitutes.

export type Artwork = {
  title: string
  year: string
  imageUrl: string
  /** Short surprising detail, revealed on hover/flip in the UI. */
  factoid?: string
}

export type Artist = {
  name: string
  years: string
  nationality: string
  bio: string
  portraitUrl: string
  works: Artwork[]
}

export type Era = {
  id: string
  name: string
  shortName: string
  yearRange: string
  tagline: string
  description: string
  characteristics: string[]
  theme: {
    accent: string
    gradientFrom: string
    gradientTo: string
    glow: string
  }
  heroArtwork: {
    title: string
    artist: string
    year: string
    imageUrl: string
    sourceCredit: string
    sourceLink: string
    /** Hook shown alongside the hero — the "did you know" that earns attention. */
    factoid: string
  }
  keyArtists: Artist[]
  /**
   * Landmark works that are still under copyright, so we cannot reproduce the
   * image (hotlinking or embedding it would put the same image on this site,
   * and most rights-holders block framing anyway). We present our own text and
   * link out to the museum that holds the work.
   */
  offsiteWorks?: {
    title: string
    artist: string
    year: string
    note: string
    holder: string
    link: string
  }[]
}

export const eras: Era[] = [
  {
    id: 'prehistoric',
    name: 'Prehistoric Art',
    shortName: 'Prehistoric',
    yearRange: '40,000 – 4,000 BCE',
    tagline: 'The first mark ever made',
    description:
      'Before writing, before cities, humans pressed pigment to cave walls by firelight. These paintings are the oldest surviving evidence of the human urge to represent the world — and to be remembered.',
    characteristics: ['Ochre & charcoal pigment', 'Animal subjects', 'Ritual & shamanic function', 'Hand stencils'],
    theme: {
      accent: '#d97706',
      gradientFrom: '#7c2d12',
      gradientTo: '#1c1207',
      glow: 'rgba(217, 119, 6, 0.35)',
    },
    heroArtwork: {
      title: 'The Hall of the Bulls, Lascaux',
      artist: 'Unknown Paleolithic artists',
      year: 'c. 17,000 BCE',
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Lascaux_painting.jpg",
      sourceCredit: 'Wikimedia Commons — Public Domain',
      sourceLink: 'https://commons.wikimedia.org/wiki/File:Lascaux_painting.jpg',
      factoid: 'The painters worked in near-total darkness, by the light of animal-fat lamps, on ceilings too high to reach — meaning someone built scaffolding 17,000 years before the pyramids.',
    },
    keyArtists: [
      {
        name: 'The Lascaux Painters',
        years: 'c. 17,000 BCE',
        nationality: 'Paleolithic Europe',
        bio: 'Anonymous artists who covered nearly 600 metres of cave wall in Dordogne, France with horses, stags and aurochs — using scaffolding, mineral pigment and the natural contours of the rock to give the animals volume.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Lascaux_painting.jpg/500px-Lascaux_painting.jpg",
        works: [
          { title: 'Hall of the Bulls', year: 'c. 17,000 BCE', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Lascaux_painting.jpg", factoid: 'One bull runs over five metres long — the largest animal figure known in cave art anywhere in the world.' },
          { title: 'Cave of Lascaux, Dordogne', year: 'c. 17,000 BCE', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/07/Lascaux2.jpg", factoid: 'Discovered in 1940 by four teenagers following their dog down a hole. Visitor breath damaged it so badly it closed in 1963; the public now visits an exact replica.' },
        ],
      },
      {
        name: 'The Altamira Painters',
        years: 'c. 36,000 – 15,000 BCE',
        nationality: 'Paleolithic Iberia',
        bio: 'Working in northern Spain across thousands of years, these artists used the cave ceiling\'s natural bulges to make polychrome bison appear to swell out of the rock — the earliest known use of three-dimensional illusion.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Altamira%2C_bison.jpg/500px-Altamira%2C_bison.jpg",
        works: [
          { title: 'Bison of Altamira', year: 'c. 15,000 BCE', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Altamira%2C_bison.jpg/960px-Altamira%2C_bison.jpg" , factoid: "The painters used the cave ceiling's natural bulges as the bison's shoulders and haunches, so the animals swell out of the rock in real three dimensions." },
        ],
      },
      {
        name: 'The Chauvet Painters',
        years: 'c. 32,000 BCE',
        nationality: 'Paleolithic France',
        bio: 'Creators of the oldest known figurative paintings on earth. Their lions, rhinos and horses show shading, perspective and implied motion — sophistication that overturned the assumption that art evolved slowly from crude beginnings.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Chauvet%C2%B4s_cave_horses.jpg/500px-Chauvet%C2%B4s_cave_horses.jpg",
        works: [
          { title: 'Panel of Horses', year: 'c. 32,000 BCE', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Chauvet%C2%B4s_cave_horses.jpg/960px-Chauvet%C2%B4s_cave_horses.jpg" , factoid: 'These are the oldest known figurative paintings on earth — roughly twice as old as Lascaux, and far more sophisticated, which forced historians to abandon the idea that art improved steadily over time.' },
        ],
      },
    ],
  },
  {
    id: 'classical',
    name: 'Ancient & Classical',
    shortName: 'Classical',
    yearRange: '3000 BCE – 400 CE',
    tagline: 'Order, proportion, empire',
    description:
      'Egypt fixed the human figure into eternal, unchanging law. Greece broke it open with contrapposto and idealised anatomy. Rome industrialised the result and carried it across three continents.',
    characteristics: ['Idealised human form', 'Mathematical proportion', 'Marble & bronze', 'Civic monumentality'],
    theme: {
      accent: '#eab308',
      gradientFrom: '#78350f',
      gradientTo: '#0c1120',
      glow: 'rgba(234, 179, 8, 0.3)',
    },
    heroArtwork: {
      title: 'Bust of Nefertiti',
      artist: 'Thutmose',
      year: 'c. 1345 BCE',
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Nofretete_Neues_Museum.jpg/1280px-Nofretete_Neues_Museum.jpg",
      sourceCredit: 'Neues Museum, Berlin — Wikimedia Commons',
      sourceLink: 'https://commons.wikimedia.org/wiki/File:Nofretete_Neues_Museum.jpg',
      factoid: "She has only one eye. The left socket was never inlaid — evidence that this flawless-looking bust was a sculptor's master reference model, kept in the workshop rather than displayed.",
    },
    keyArtists: [
      {
        name: 'Thutmose',
        years: 'fl. c. 1350 BCE',
        nationality: 'Egyptian',
        bio: 'Court sculptor to Pharaoh Akhenaten at Amarna. His workshop, excavated in 1912, still contained the painted limestone bust of Queen Nefertiti — a study piece that became one of the most reproduced faces in history.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Nofretete_Neues_Museum.jpg/500px-Nofretete_Neues_Museum.jpg",
        works: [
          { title: 'Bust of Nefertiti', year: 'c. 1345 BCE', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Nofretete_Neues_Museum.jpg/960px-Nofretete_Neues_Museum.jpg", factoid: 'Beneath the painted stucco is a limestone core with a subtly different face — creases at the mouth and a bump on the nose that the outer layer smooths away.' },
        ],
      },
      {
        name: 'Phidias',
        years: 'c. 480 – 430 BCE',
        nationality: 'Greek',
        bio: 'The supreme sculptor of Athens\' golden age. He directed the Parthenon\'s sculptural programme and made the colossal chryselephantine statues of Athena and Zeus — the latter counted among the Seven Wonders.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Egastinai_frieze_Louvre_MR825.jpg/500px-Egastinai_frieze_Louvre_MR825.jpg",
        works: [
          { title: 'Parthenon Frieze', year: 'c. 440 BCE', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Egastinai_frieze_Louvre_MR825.jpg/960px-Egastinai_frieze_Louvre_MR825.jpg", factoid: 'The marble was originally painted in strong reds and blues. The austere white classicism the West later imitated is simply what was left after the colour wore off.' },
        ],
      },
      {
        name: 'Polykleitos',
        years: 'c. 480 – 420 BCE',
        nationality: 'Greek',
        bio: 'Author of the Canon, a written treatise defining the perfect mathematical ratios of the human body. He demonstrated it in bronze with the Doryphoros — the spear-bearer whose weight-shifted stance defined classical sculpture.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Doryphoros_MAN_Napoli_Inv6011-2.jpg/500px-Doryphoros_MAN_Napoli_Inv6011-2.jpg",
        works: [
          { title: 'Doryphoros (Spear-Bearer)', year: 'c. 440 BCE', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Doryphoros_MAN_Napoli_Inv6011-2.jpg" , factoid: 'The original bronze is lost. Every version you have ever seen is a Roman marble copy — including the awkward tree stump, which marble needs for support and bronze does not.' },
        ],
      },
    ],
  },
  {
    id: 'medieval',
    name: 'Medieval Art',
    shortName: 'Medieval',
    yearRange: '400 – 1400',
    tagline: 'Gold ground, divine light',
    description:
      'For a thousand years art served the sacred. Naturalism gave way to gold leaf, flattened space and symbol — not because artists could not see, but because what they depicted was not meant to be of this world.',
    characteristics: ['Gold-leaf grounds', 'Symbolic flat space', 'Illuminated manuscripts', 'Gothic verticality'],
    theme: {
      accent: '#f59e0b',
      gradientFrom: '#4c1d95',
      gradientTo: '#0a0a18',
      glow: 'rgba(245, 158, 11, 0.28)',
    },
    heroArtwork: {
      title: 'The Trinity (Icon of the Holy Trinity)',
      artist: 'Andrei Rublev',
      year: 'c. 1411',
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Angelsatmamre-trinity-rublev-1410.jpg/1280px-Angelsatmamre-trinity-rublev-1410.jpg",
      sourceCredit: 'Tretyakov Gallery, Moscow — Wikimedia Commons',
      sourceLink: 'https://commons.wikimedia.org/wiki/File:Angelsatmamre-trinity-rublev-1410.jpg',
      factoid: 'The three angels lean into an invisible circle, and the gap at the front of the table is deliberate — the composition leaves an empty seat facing the viewer.',
    },
    keyArtists: [
      {
        name: 'Andrei Rublev',
        years: 'c. 1360 – 1430',
        nationality: 'Russian',
        bio: 'A monk-painter whose icons brought a new tenderness to the rigid Byzantine tradition. The Trinity — three angels seated around a chalice in silent, circular communion — is considered the summit of Russian religious art.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Angelsatmamre-trinity-rublev-1410.jpg/500px-Angelsatmamre-trinity-rublev-1410.jpg",
        works: [
          { title: 'The Trinity', year: 'c. 1411', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Angelsatmamre-trinity-rublev-1410.jpg/960px-Angelsatmamre-trinity-rublev-1410.jpg", factoid: 'Rublev left the front of the table open so the viewer completes the circle — you are meant to occupy the empty fourth place.' },
        ],
      },
      {
        name: 'Giotto di Bondone',
        years: 'c. 1267 – 1337',
        nationality: 'Italian',
        bio: 'The hinge between medieval and Renaissance. Giotto gave his figures weight, grief and real space to stand in — his Scrovegni Chapel frescoes in Padua are where European painting begins to look outward at the world.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Giotto_-_Scrovegni_-_-36-_-_Lamentation_%28The_Mourning_of_Christ%29_adj.jpg/500px-Giotto_-_Scrovegni_-_-36-_-_Lamentation_%28The_Mourning_of_Christ%29_adj.jpg",
        works: [
          { title: 'Lamentation of Christ', year: 'c. 1305', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Giotto_-_Scrovegni_-_-36-_-_Lamentation_%28The_Mourning_of_Christ%29_adj.jpg/960px-Giotto_-_Scrovegni_-_-36-_-_Lamentation_%28The_Mourning_of_Christ%29_adj.jpg", factoid: "The angels overhead are contorted with grief, but Giotto's real innovation is at the bottom: two mourners seen from behind, faces hidden, pulling the viewer into the scene." },
        ],
      },
      {
        name: 'The Limbourg Brothers',
        years: 'c. 1385 – 1416',
        nationality: 'Franco-Flemish',
        bio: 'Herman, Paul and Johan, three brothers who illuminated Les Très Riches Heures du Duc de Berry. Their calendar pages — peasants and castles under deep lapis skies — are the finest surviving Gothic manuscript painting.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Les_Tr%C3%A8s_Riches_Heures_du_duc_de_Berry_Janvier.jpg/500px-Les_Tr%C3%A8s_Riches_Heures_du_duc_de_Berry_Janvier.jpg",
        works: [
          { title: 'Les Très Riches Heures: January', year: 'c. 1412', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Les_Tr%C3%A8s_Riches_Heures_du_duc_de_Berry_Janvier.jpg/960px-Les_Tr%C3%A8s_Riches_Heures_du_duc_de_Berry_Janvier.jpg", factoid: "The blues come from lapis lazuli ground finer than gold dust and shipped from Afghanistan — pigment worth more than the painters' wages." },
        ],
      },
    ],
  },
  {
    id: 'renaissance',
    name: 'The Renaissance',
    shortName: 'Renaissance',
    yearRange: '1400 – 1600',
    tagline: 'Man becomes the measure',
    description:
      'Linear perspective turned the picture plane into a window. Anatomy, humanism and patronage collided in Florence and Rome to produce the most concentrated burst of genius in Western art.',
    characteristics: ['Linear perspective', 'Anatomical realism', 'Classical revival', 'Oil on panel & fresco'],
    theme: {
      accent: '#fbbf24',
      gradientFrom: '#713f12',
      gradientTo: '#0b0f1a',
      glow: 'rgba(251, 191, 36, 0.3)',
    },
    heroArtwork: {
      title: 'The Birth of Venus',
      artist: 'Sandro Botticelli',
      year: 'c. 1485',
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1920px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
      sourceCredit: 'Uffizi Gallery, Florence — Wikimedia Commons',
      sourceLink: 'https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
      factoid: 'Botticelli mixed powdered alabaster into his pigments to make the surface luminous, and Venus stands on a scallop shell in an anatomically impossible pose — her neck and left shoulder could not exist on a real body.',
    },
    keyArtists: [
      {
        name: 'Leonardo da Vinci',
        years: '1452 – 1519',
        nationality: 'Italian',
        bio: 'Painter, anatomist, engineer. He finished few works but changed everything he touched — inventing sfumato, the smoke-soft transition between tones that gives the Mona Lisa her unresolvable expression.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Leonardo_self.jpg",
        works: [
          { title: 'Mona Lisa', year: 'c. 1503–1519', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/960px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg", factoid: 'She had no particular fame until 1911, when a Louvre employee walked out with her under his coat. The two-year manhunt made her the most famous painting on earth.' },
          { title: 'The Last Supper', year: 'c. 1495–1498', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/960px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg" , factoid: 'Leonardo experimented with paint on dry plaster instead of true fresco. It began flaking within his lifetime, making his most famous mural a ruin almost from the start.' },
          { title: 'Vitruvian Man', year: 'c. 1490', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg/960px-Da_Vinci_Vitruve_Luc_Viatour.jpg" , factoid: 'It was never meant to be seen. Leonardo drew it in a private notebook as a working note on proportion, not as a picture for anyone else.' },
        ],
      },
      {
        name: 'Michelangelo Buonarroti',
        years: '1475 – 1564',
        nationality: 'Italian',
        bio: 'He called himself a sculptor and painted the Sistine ceiling under protest — 500 square metres, four years, largely alone. His figures carry a physical torsion and moral weight no one has matched since.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Miguel_%C3%81ngel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg/500px-Miguel_%C3%81ngel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg",
        works: [
          { title: 'The Creation of Adam', year: 'c. 1512', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/960px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg" , factoid: 'The shape framing God is an near-exact anatomical cross-section of the human brain — an argument, some scholars believe, that the gift being passed to Adam is intellect.' },
          { title: 'David', year: '1501–1504', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/%27David%27_by_Michelangelo_Fir_JBU005_denoised.jpg/960px-%27David%27_by_Michelangelo_Fir_JBU005_denoised.jpg" , factoid: 'The marble block had been abandoned as ruined for 25 years after two other sculptors gave up on it. Michelangelo was 26 when he took it on.' },
        ],
      },
      {
        name: 'Raphael',
        years: '1483 – 1520',
        nationality: 'Italian',
        bio: 'The most effortlessly graceful of the three masters. Dead at 37, he had already painted The School of Athens — a fresco that gathers all of classical philosophy into one perfectly balanced architectural space.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Raffael_060.jpg/500px-Raffael_060.jpg",
        works: [
          { title: 'The School of Athens', year: '1509–1511', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/960px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg" , factoid: 'Raphael painted his rivals into it: Plato is widely read as Leonardo, the brooding figure on the steps as Michelangelo, and Raphael slipped his own face into the crowd on the right.' },
        ],
      },
    ],
  },
  {
    id: 'baroque',
    name: 'Baroque & Golden Age',
    shortName: 'Baroque',
    yearRange: '1600 – 1750',
    tagline: 'Light as drama',
    description:
      'The Counter-Reformation wanted art that seized you by the collar. Caravaggio supplied it with raking light and dirty feet; the Dutch Republic answered with quiet interiors lit by a single window.',
    characteristics: ['Tenebrism & chiaroscuro', 'Theatrical movement', 'Psychological realism', 'Domestic intimacy'],
    theme: {
      accent: '#dc2626',
      gradientFrom: '#450a0a',
      gradientTo: '#08080f',
      glow: 'rgba(220, 38, 38, 0.3)',
    },
    heroArtwork: {
      title: 'Girl with a Pearl Earring',
      artist: 'Johannes Vermeer',
      year: 'c. 1665',
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meisje_met_de_parel.jpg/1280px-Meisje_met_de_parel.jpg",
      sourceCredit: 'Mauritshuis, The Hague — Wikimedia Commons',
      sourceLink: 'https://commons.wikimedia.org/wiki/File:Meisje_met_de_parel.jpg',
      factoid: 'The pearl is two brushstrokes and probably not a pearl — it would be impossibly large. And this is not a portrait of anyone: it is a *tronie*, a study of a type rather than a person.',
    },
    keyArtists: [
      {
        name: 'Caravaggio',
        years: '1571 – 1610',
        nationality: 'Italian',
        bio: 'A brawler who died on the run at 38, and the most influential painter of his century. He lit sacred scenes like a crime and cast street people as saints — scandalising patrons and rewiring European painting.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Bild-Ottavio_Leoni%2C_Caravaggio.jpg/500px-Bild-Ottavio_Leoni%2C_Caravaggio.jpg",
        works: [
          { title: 'The Calling of Saint Matthew', year: '1599–1600', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Calling_of_Saint_Matthew-Caravaggo_%281599-1600%29.jpg/960px-The_Calling_of_Saint_Matthew-Caravaggo_%281599-1600%29.jpg" , factoid: "The beam of light enters at exactly the angle of the real window in the chapel where it hangs, so the painted light and the room's light are the same light." },
          { title: 'Judith Beheading Holofernes', year: 'c. 1599', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Caravaggio_Judith_Beheading_Holofernes.jpg/960px-Caravaggio_Judith_Beheading_Holofernes.jpg", factoid: "Caravaggio painted a real severed-head study for this — and gave Holofernes' agonised face his own likeness." },
        ],
      },
      {
        name: 'Rembrandt van Rijn',
        years: '1606 – 1669',
        nationality: 'Dutch',
        bio: 'The greatest painter of human interiority. He painted roughly eighty self-portraits across forty years, tracking his own face from cocky young success to bankrupt old man with unflinching honesty.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg",
        works: [
          { title: 'The Night Watch', year: '1642', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg/960px-The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg" , factoid: "It is neither a night scene nor its real size. Centuries of darkened varnish created the 'night', and in 1715 the canvas was cut down on all four sides to fit a wall." },
          { title: 'Self-Portrait', year: '1659', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/960px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg", factoid: 'Painted the year he was declared insolvent and his possessions were auctioned off. He looks straight out, neither pleading nor apologising.' },
        ],
      },
      {
        name: 'Artemisia Gentileschi',
        years: '1593 – 1656',
        nationality: 'Italian',
        bio: 'The first woman admitted to Florence\'s Accademia delle Arti del Disegno. She painted biblical heroines with a ferocity no male contemporary attempted — her Judith is all muscle, leverage and resolve.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Self-portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg/500px-Self-portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg",
        works: [
          { title: 'Judith Slaying Holofernes', year: 'c. 1620', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Artemisia_Gentileschi_-_Giuditta_decapita_Oloferne_-_Google_Art_Project-Adjust.jpg/960px-Artemisia_Gentileschi_-_Giuditta_decapita_Oloferne_-_Google_Art_Project-Adjust.jpg" , factoid: 'Gentileschi painted it after being raped by her tutor and enduring a trial in which she was tortured with thumbscrews to test her testimony. She gave Judith her own face.' },
          { title: 'Self-Portrait as the Allegory of Painting', year: 'c. 1638', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Self-portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg/960px-Self-portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg", factoid: 'By painting herself *as* the art of Painting, Gentileschi made a claim no male artist could copy: allegory was always female, so only a woman could be both the painter and the ideal.' },
        ],
      },
    ],
  },
  {
    id: 'impressionism',
    name: 'Impressionism',
    shortName: 'Impressionism',
    yearRange: '1860 – 1900',
    tagline: 'Painting the moment it happens',
    description:
      'Rejected by the Salon, a handful of painters left the studio for the riverbank. Portable paint tubes and broken brushwork let them chase light itself — and the Post-Impressionists then bent that freedom toward pure emotion.',
    characteristics: ['Plein-air painting', 'Broken colour & visible strokes', 'Fleeting light', 'Modern everyday life'],
    theme: {
      accent: '#38bdf8',
      gradientFrom: '#1e3a8a',
      gradientTo: '#080c18',
      glow: 'rgba(56, 189, 248, 0.32)',
    },
    heroArtwork: {
      title: 'The Starry Night',
      artist: 'Vincent van Gogh',
      year: '1889',
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1920px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      sourceCredit: 'Museum of Modern Art, New York — Wikimedia Commons',
      sourceLink: 'https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      factoid: 'Van Gogh painted this from memory in an asylum room whose window faced east — and mathematicians have found that its swirls closely model turbulent flow, a phenomenon not described until decades later.',
    },
    keyArtists: [
      {
        name: 'Claude Monet',
        years: '1840 – 1926',
        nationality: 'French',
        bio: 'The movement took its name from his Impression, Sunrise — originally an insult from a critic. He spent his last decades painting the same water-lily pond hundreds of times, dissolving form into pure light.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_1899_Nadar_crop.jpg/500px-Claude_Monet_1899_Nadar_crop.jpg",
        works: [
          { title: 'Impression, Sunrise', year: '1872', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/960px-Monet_-_Impression%2C_Sunrise.jpg" , factoid: "A critic coined 'Impressionism' from this title as an insult, sneering that wallpaper was more finished. The painters adopted the slur as their name." },
          { title: 'Water Lilies', year: 'c. 1916', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/960px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg", factoid: "Monet's cataracts turned his later vision muddy red and yellow. After surgery he saw ultraviolet — and repainted canvases he now found unbearably blue." },
        ],
      },
      {
        name: 'Vincent van Gogh',
        years: '1853 – 1890',
        nationality: 'Dutch',
        bio: 'He painted for barely ten years and sold almost nothing in his lifetime. Colour, for him, carried feeling directly — the swirling sky of The Starry Night was painted from the window of an asylum in Saint-Rémy.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/500px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg",
        works: [
          { title: 'The Starry Night', year: '1889', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/960px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg", factoid: 'The village below is Dutch, not French. Van Gogh painted a church spire from his memory of home into a Provençal landscape that never had one.' },
          { title: 'Sunflowers', year: '1888', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/960px-Vincent_Willem_van_Gogh_127.jpg" , factoid: 'Van Gogh used a brand-new pigment, chrome yellow, that was known even then to be unstable. The flowers are measurably browner today than he painted them.' },
          { title: 'Self-Portrait', year: '1889', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/960px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg", factoid: 'He painted over thirty self-portraits in four years, largely because he could not afford to pay models.' },
        ],
      },
      {
        name: 'Edgar Degas',
        years: '1834 – 1917',
        nationality: 'French',
        bio: 'He disliked the label Impressionist and preferred "realist". Obsessed with the ballet, he studied dancers off-guard — stretching, adjusting a strap, exhausted — from radical Japanese-print viewpoints.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Edgar_Germain_Hilaire_Degas_017.jpg/500px-Edgar_Germain_Hilaire_Degas_017.jpg",
        works: [
          { title: 'The Ballet Class', year: 'c. 1874', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Edgar_Germain_Hilaire_Degas_017.jpg/960px-Edgar_Germain_Hilaire_Degas_017.jpg", factoid: 'Degas was going blind as he painted dancers. In his last years he turned to sculpture, working in wax by touch when he could no longer see.' },
          { title: 'L\'Absinthe', year: '1876', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Edgar_Degas_-_In_a_Caf%C3%A9_-_Google_Art_Project_2.jpg/960px-Edgar_Degas_-_In_a_Caf%C3%A9_-_Google_Art_Project_2.jpg", factoid: "Exhibited in London, it was denounced as a lesson in degradation — critics attacked the two models personally, and the outcry was so severe it was withdrawn from view." },
        ],
      },
    ],
  },
  {
    id: 'modern',
    name: 'Modern Art',
    shortName: 'Modern',
    yearRange: '1890 – 1950',
    tagline: 'Break the frame',
    description:
      'Photography had taken over the job of recording the world, so painting went looking for another one. Within two generations art turned inward to raw anxiety, outward to pure geometry, and finally to the loneliness of the modern city.',
    characteristics: ['Psychological expression', 'Pure abstraction', 'Flattened picture plane', 'Urban alienation'],
    theme: {
      accent: '#e879f9',
      gradientFrom: '#701a75',
      gradientTo: '#08060f',
      glow: 'rgba(232, 121, 249, 0.32)',
    },
    heroArtwork: {
      title: 'The Scream',
      artist: 'Edvard Munch',
      year: '1893',
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/1920px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
      sourceCredit: 'National Gallery of Norway, Oslo — Wikimedia Commons',
      sourceLink: 'https://commons.wikimedia.org/wiki/File:Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg',
      factoid: 'The figure is not screaming. Munch wrote that he was walking at sunset when he heard "an infinite scream passing through nature" — the figure is covering its ears against a sound the whole sky is making.',
    },
    keyArtists: [
      {
        name: 'Edvard Munch',
        years: '1863 – 1944',
        nationality: 'Norwegian',
        bio: 'He lost his mother and sister to tuberculosis before he was fourteen, and spent his career painting grief, jealousy and dread as if they were weather. The Scream exists in four versions; two have been stolen and recovered.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Edvard_Munch_1933-2.jpg/500px-Edvard_Munch_1933-2.jpg",
        works: [
          {
            title: 'The Scream',
            year: '1893',
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/960px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
            factoid: 'A faint pencil line in the corner reads "could only have been painted by a madman" — analysis in 2021 confirmed the handwriting is Munch\'s own.',
          },
        ],
      },
      {
        name: 'Gustav Klimt',
        years: '1862 – 1918',
        nationality: 'Austrian',
        bio: 'Leader of the Vienna Secession, who covered his canvases in real gold leaf — a technique learned from his father, a gold engraver. His work fused Byzantine opulence with unmistakably modern eroticism.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gustav_Klimt_016.jpg/500px-Gustav_Klimt_016.jpg",
        works: [
          {
            title: 'The Kiss',
            year: '1907–1908',
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gustav_Klimt_016.jpg/960px-Gustav_Klimt_016.jpg",
            factoid: 'The gold is not paint. Klimt applied genuine gold and silver leaf to the canvas, making The Kiss closer to a Byzantine icon than a modern painting.',
          },
          {
            title: 'Judith and the Head of Holofernes',
            year: '1901',
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Gustav_Klimt_046.jpg/960px-Gustav_Klimt_046.jpg",
            factoid: 'Viewers found this Judith so unsettlingly sensual that galleries relabelled her "Salome" for decades, unwilling to accept a biblical heroine depicted in open ecstasy.',
          },
        ],
      },
      {
        name: 'Piet Mondrian',
        years: '1872 – 1944',
        nationality: 'Dutch',
        bio: 'He began painting naturalistic windmills and trees, then spent thirty years stripping them away until only black lines and three primary colours remained. He believed this was not simplification but the discovery of an underlying universal order.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/500px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg",
        works: [
          {
            title: 'Composition II in Red, Blue, and Yellow',
            year: '1930',
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/960px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg",
            factoid: 'Mondrian refused to use green and reportedly turned his chair away from windows to avoid seeing it. He found the colour of nature unbearable in a painting.',
          },
        ],
      },
      {
        name: 'Edward Hopper',
        years: '1882 – 1967',
        nationality: 'American',
        bio: 'The great painter of American solitude. His figures sit in diners, hotel rooms and offices, lit harshly and rarely looking at one another — images that have shaped how film noir and cinema frame loneliness ever since.',
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/500px-Nighthawks_by_Edward_Hopper_1942.jpg",
        works: [
          {
            title: 'Nighthawks',
            year: '1942',
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/960px-Nighthawks_by_Edward_Hopper_1942.jpg",
            factoid: 'There is no door. Look along the diner\'s glass and you will find no way in or out — a detail Hopper never explained, and which quietly seals the figures inside.',
          },
        ],
      },
    ],
    offsiteWorks: [
      {
        title: 'The Persistence of Memory',
        artist: 'Salvador Dalí',
        year: '1931',
        note: 'The melting watches came to Dalí from a wheel of Camembert softening in the sun. The pale creature draped across the centre is a distorted self-portrait in profile.',
        holder: 'MoMA, New York',
        link: 'https://www.moma.org/collection/works/79018',
      },
      {
        title: 'Guernica',
        artist: 'Pablo Picasso',
        year: '1937',
        note: 'Painted in a month after the bombing of a Basque town, in black, white and grey like newsprint. Picasso refused to let it enter Spain until the country returned to democracy.',
        holder: 'Museo Reina Sofía, Madrid',
        link: 'https://www.museoreinasofia.es/en/collection/artwork/guernica',
      },
      {
        title: "Les Demoiselles d'Avignon",
        artist: 'Pablo Picasso',
        year: '1907',
        note: 'Picasso kept it rolled in his studio for nine years, unsure it could be shown. Two faces are modelled on African masks — the moment European painting broke with perspective.',
        holder: 'MoMA, New York',
        link: 'https://www.moma.org/collection/works/79766',
      },
    ],
  },
]