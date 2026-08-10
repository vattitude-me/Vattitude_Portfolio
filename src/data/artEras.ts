// Curated art-history dataset.
//
// Every image URL here was resolved through the Wikimedia Commons API and
// verified to return a real image, so nothing depends on a live API at runtime.
// Note: Commons only serves specific thumbnail widths per file, so these URLs
// are the exact ones the API issued - do not hand-edit the `NNNpx-` segment.
//
// Selection rule: each era leads with the single most recognisable work that is
// genuinely public domain. Some 20th-century icons (Dali's Persistence of
// Memory, Picasso's Guernica and Demoiselles) are still under copyright and are
// unavailable from Commons, the Met, and the Art Institute alike - so they are
// listed under `offsiteWorks` with a link to the holding museum instead of
// being reproduced here.
//
// Museum attributions were written from general knowledge and spot-checked, not
// verified line-by-line against each institution's catalogue. Treat the
// `sourceCredit` text as indicative; the `imageUrl` values are the part that is
// machine-verified.
//
// Licensing note for the `contemporary` era: unlike every earlier era, whose
// images are public domain, its images are CC BY or CC BY-SA. Those licences
// REQUIRE visible attribution to the photographer, so each `sourceCredit` there
// names the photographer and licence and must not be shortened. The era is also
// deliberately weighted to sculpture, installation and street art: the US has no
// freedom of panorama and no post-1950 painting of note is freely licensed, so
// Pollock, Rothko, Warhol and Basquiat appear under `offsiteWorks` instead.

export type Artwork = {
  title: string
  year: string
  imageUrl: string
  /** Short surprising detail, revealed on hover/flip in the UI. */
  factoid?: string
  /** Where the work hangs today, and a link to it - mirrors the era hero's credit. */
  sourceCredit?: string
  sourceLink?: string
}

export type Artist = {
  name: string
  years: string
  nationality: string
  bio: string
  portraitUrl: string
  /** Low-quality portrait shown while main portrait loads. */
  portraitPlaceholder?: string
  works: Artwork[]
  /**
   * Longer biography, shown only on the era deep-dive page. Optional so the
   * timeline's short `bio` stays the single required field.
   */
  longBio?: string
  /** One-line hook under the name in the deep-dive artist grid. */
  epithet?: string
}

/** A dated event on the deep-dive page's era chronology. */
export type EraMoment = {
  year: string
  title: string
  detail: string
  /**
   * Title of a work in this era's `keyArtists` that the moment is actually
   * about, so the chronology can show it. Hand-curated rather than matched by
   * name at runtime: fuzzy matching happily paired "Artemisia's trial" with
   * "The Art of Painting", and the wrong painting against a date teaches
   * something false. Moments with no honest match (Cubism, the Salon des
   * Refusés) simply omit it and render as text.
   */
  anchorWork?: string
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
    /** Low-quality image shown while the main image loads (LQIP). */
    placeholderUrl?: string
    sourceCredit: string
    sourceLink: string
    /** Hook shown alongside the hero - the "did you know" that earns attention. */
    factoid: string
  }
  keyArtists: Artist[]
  /**
   * Deep-dive-only content. All optional: the timeline renders without it, and
   * eras gain it as they are written up.
   */
  deepDive?: {
    /** 2-3 paragraphs of real context, shown under the deep-dive hero. */
    essay: string[]
    /** Dated chronology rendered as a vertical spine. */
    moments: EraMoment[]
    /** "What to look for" - how to actually read a work from this era. */
    lookFor: { label: string; detail: string }[]
    /** Closing line that hands off to the next era. */
    legacy?: string
  }
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
    "id": "prehistoric",
    "name": "Prehistoric Art",
    "shortName": "Prehistoric",
    "yearRange": "40,000 – 4,000 BCE",
    "tagline": "The first hands on the wall",
    "description": "Before writing, before cities, before agriculture, people crawled deep into unlit caves and painted animals with astonishing confidence. This is the oldest surviving evidence that humans make images — not for use, but because we need to.",
    "characteristics": [
      "Charcoal & ochre",
      "Animal subjects",
      "Deep cave interiors",
      "Hand stencils"
    ],
    "theme": {
      "accent": "#f59e0b",
      "gradientFrom": "#78350f",
      "gradientTo": "#0c0a09",
      "glow": "rgba(245, 158, 11, 0.3)"
    },
    "heroArtwork": {
      "title": "The Hall of the Bulls",
      "artist": "The Lascaux painters",
      "year": "c. 17,000 BCE",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Lascaux_painting.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
      "placeholderUrl": "/placeholder-hero-prehistoric.jpg",
      "sourceCredit": "Cave of Lascaux, Dordogne — replica at Lascaux IV",
      "sourceLink": "https://archeologie.culture.gouv.fr/lascaux/en",
      "factoid": "Lascaux was found in 1940 by four teenagers following a dog down a hole. Within twenty years the breath of visitors had grown algae and crystals across the paintings, and the cave was sealed — what tourists visit today is a full-scale replica."
    },
    "deepDive": {
      "essay": [
        "For most of human history, the record is silent. Then, roughly forty thousand years ago and across three continents at once, people began to paint — and what they painted was almost never themselves.",
        "The caves are not homes. Lascaux, Altamira and Chauvet are galleries buried hundreds of metres into rock, reachable only by crawling through passages in total darkness, carrying fat lamps that burned for a few hours at a time. The artists went there deliberately, repeatedly, over thousands of years, and worked on surfaces no one would casually see. Whatever these images were for, convenience had nothing to do with it.",
        "What survives is technically extraordinary. The painters used the natural bulges of the rock so a bison's flank swells where the wall swells. They drew animals in motion, overlapping legs to suggest a running herd — an effect that flickers into life under a moving flame, which is the only light these were ever meant to be seen in."
      ],
      "moments": [
        {
          "year": "c. 40,000 BCE",
          "title": "The first marks",
          "detail": "Hand stencils and simple discs appear on cave walls in Spain and Indonesia — the earliest images we can date, made by blowing pigment around a hand held to the rock.",
          "anchorWork": "Bhimbetka rock shelters"
        },
        {
          "year": "c. 32,000 BCE",
          "title": "Chauvet",
          "detail": "A cave in southern France is decorated with lions, rhinos and horses of startling sophistication, then sealed by a rockfall — preserving the oldest well-dated paintings on earth.",
          "anchorWork": "Panel of the Horses"
        },
        {
          "year": "c. 25,000 BCE",
          "title": "Portable figures",
          "detail": "Small carved figures like the Venus of Willendorf spread across Europe — art that could travel with a group rather than waiting in a cave.",
          "anchorWork": "Venus of Willendorf"
        },
        {
          "year": "c. 17,000 BCE",
          "title": "Lascaux",
          "detail": "Nearly 600 painted animals cover the walls of a Dordogne cave system, including the Hall of the Bulls, the largest of which runs over five metres long.",
          "anchorWork": "The Hall of the Bulls"
        },
        {
          "year": "c. 15,000 BCE",
          "title": "Altamira",
          "detail": "Polychrome bison are painted on a low Spanish ceiling. When published in 1880, experts declared them a forgery — no \"primitive\" people could have made them. It took decades to admit they were genuine.",
          "anchorWork": "Bison of Altamira"
        }
      ],
      "lookFor": [
        {
          "label": "The rock is part of the picture",
          "detail": "Painters chose bulges and hollows that already resembled a shoulder or a haunch, then painted to fit. The image is three-dimensional by design."
        },
        {
          "label": "Animals, not people",
          "detail": "Horses, bison, aurochs and deer dominate. Humans, when they appear at all, are crude stick figures — a striking reversal of every later tradition."
        },
        {
          "label": "Overlap and repetition",
          "detail": "Figures are painted over each other across centuries. There is no single composition; the wall accumulated."
        },
        {
          "label": "Firelight, not daylight",
          "detail": "The palette is charcoal black and ochre red-yellow — colours that stay legible under flame. These works go flat under electric light."
        }
      ],
      "legacy": "Everything that follows — every altarpiece, every portrait, every canvas in this timeline — descends from the impulse that sent someone crawling into the dark with a lamp and a handful of ground earth."
    },
    "keyArtists": [
      {
        "name": "The Lascaux Painters",
        "years": "c. 17,000 BCE",
        "nationality": "Magdalenian, southwestern France",
        "epithet": "Anonymous masters of the Hall of the Bulls",
        "bio": "Unknown hands who covered a Dordogne cave system with nearly 600 animals, working by lamplight on scaffolding whose post-holes are still visible in the rock.",
        "longBio": "No names survive, and no single artist made Lascaux — the cave was painted and repainted over generations. What the evidence does show is organised work: sockets cut into the walls to hold scaffolding, mineral pigments ground and carried in from elsewhere, and hollowed stone lamps that burned animal fat. Some of the animals are over five metres long and could only have been drawn by someone who could not see the whole figure at once, working to a plan held in the head.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/6/65/Lascaux_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "The Hall of the Bulls",
            "year": "c. 17,000 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Lascaux_painting.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "The largest aurochs here runs more than five metres — painted by an artist who, in a narrow cave by lamplight, could never step back far enough to see it whole.",
            "sourceCredit": "Cave of Lascaux, Dordogne — replica at Lascaux IV",
            "sourceLink": "https://archeologie.culture.gouv.fr/lascaux/en"
          },
          {
            "title": "Painted Gallery, Lascaux",
            "year": "c. 17,000 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/65/Lascaux_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "The cave was closed to the public in 1963: visitors' breath had raised carbon dioxide and humidity enough to grow algae over the paint. A replica now takes 250,000 visitors a year.",
            "sourceCredit": "Cave of Lascaux, Dordogne — replica at Lascaux IV",
            "sourceLink": "https://archeologie.culture.gouv.fr/lascaux/en"
          }
        ]
      },
      {
        "name": "The Altamira Painters",
        "years": "c. 15,000 BCE",
        "nationality": "Magdalenian, northern Spain",
        "epithet": "Painters of the ceiling nobody believed",
        "bio": "Their polychrome bison, painted on a low Cantabrian ceiling, were dismissed as a modern hoax for over twenty years because scholars refused to believe prehistoric people capable of them.",
        "longBio": "Altamira was found in 1868 and properly explored in 1879, when the daughter of the excavating amateur looked up and saw the ceiling. Her father published the bison as Palaeolithic; the archaeological establishment accused him of hiring a painter to forge them. He died discredited. Only after comparable caves turned up in France in the early 1900s was Altamira accepted — by which time the man who found it had been dead for fifteen years.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Altamira%2C_bison.jpg/960px-Altamira%2C_bison.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Bison of Altamira",
            "year": "c. 15,000 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Altamira%2C_bison.jpg/960px-Altamira%2C_bison.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The painters worked the bison around natural bulges in the ceiling, so the animals' flanks physically swell out of the rock. It is sculpture as much as painting.",
            "sourceCredit": "Museo de Altamira, Santillana del Mar",
            "sourceLink": "https://www.culturaydeporte.gob.es/mnaltamira/en/home.html"
          },
          {
            "title": "The Polychrome Ceiling",
            "year": "c. 15,000 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Altamira_ceiling_02.JPG/960px-Altamira_ceiling_02.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "When the bison were published in 1880, the scientific consensus was fraud. The discoverer was accused of hiring an artist and died before the cave was accepted as genuine.",
            "sourceCredit": "Museo de Altamira, Santillana del Mar",
            "sourceLink": "https://www.culturaydeporte.gob.es/mnaltamira/en/home.html"
          }
        ]
      },
      {
        "name": "The Chauvet Painters",
        "years": "c. 32,000 BCE",
        "nationality": "Aurignacian, southern France",
        "epithet": "The oldest well-dated paintings on earth",
        "bio": "Their lions, rhinos and horses predate Lascaux by fifteen thousand years — and are no cruder. The idea that art improved steadily from primitive beginnings did not survive this cave.",
        "longBio": "Chauvet was sealed by a rockfall around 21,000 BCE and not reopened until 1994, leaving the floor undisturbed with bear tracks and hearths intact. The paintings inside are the oldest securely dated in the world, and they use shading, perspective and implied motion. Because they are twice as old as Lascaux and just as accomplished, they destroyed the long-held assumption that palaeolithic art evolved gradually toward competence.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/13_PanneauDesChevaux%28D%C3%A9tail%29.jpg/960px-13_PanneauDesChevaux%28D%C3%A9tail%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Panel of the Horses",
            "year": "c. 32,000 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/13_PanneauDesChevaux%28D%C3%A9tail%29.jpg/960px-13_PanneauDesChevaux%28D%C3%A9tail%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The artists scraped the wall pale before drawing, so the charcoal reads sharply against it — a deliberate preparation of the surface, 32,000 years ago.",
            "sourceCredit": "Grotte Chauvet-Pont d'Arc, Ardèche — replica at Chauvet 2",
            "sourceLink": "https://archeologie.culture.gouv.fr/chauvet/en"
          },
          {
            "title": "The Horse Panel, full view",
            "year": "c. 32,000 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/29_PanneauDesChevaux%28VueG%C3%A9n%C3%A9rale%29.jpg/960px-29_PanneauDesChevaux%28VueG%C3%A9n%C3%A9rale%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Some animals are drawn with extra overlapping legs — an effect that reads as movement when seen by a moving flame, which was the only light available.",
            "sourceCredit": "Grotte Chauvet-Pont d'Arc, Ardèche — replica at Chauvet 2",
            "sourceLink": "https://archeologie.culture.gouv.fr/chauvet/en"
          }
        ]
      },
      {
        "name": "The Figurine Carvers",
        "years": "c. 28,000 BCE",
        "nationality": "Gravettian, central Europe",
        "epithet": "The first portable art",
        "bio": "Anonymous carvers who made small limestone and ivory figures that could be carried — art detached from a place for the first time.",
        "longBio": "The so-called \"Venus\" figurines appear across Europe from France to Siberia over several thousand years, remarkably consistent in form. They are small enough to close a hand around. Because they travel, they mark a real shift: an image that belongs to a person rather than to a cave. The Venus of Willendorf was carved from a limestone not found within a hundred miles of where it was buried, and still carries traces of red ochre.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Venus_von_Willendorf_01.jpg/960px-Venus_von_Willendorf_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Venus of Willendorf",
            "year": "c. 28,000 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Venus_von_Willendorf_01.jpg/960px-Venus_von_Willendorf_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "She is 11cm tall, has no face, and was carved from oolitic limestone that does not occur anywhere near where she was found — she was carried a long way.",
            "sourceCredit": "Naturhistorisches Museum, Vienna",
            "sourceLink": "https://www.nhm-wien.ac.at/en"
          }
        ]
      },
      {
        "name": "The Bhimbetka Painters",
        "years": "c. 8,000 BCE onward",
        "nationality": "Indian subcontinent",
        "epithet": "Ten thousand years of one rock shelter",
        "bio": "Successive generations painted the same central Indian rock shelters for millennia, leaving hunting scenes, dances and eventually horses and riders layered over each other.",
        "longBio": "The Bhimbetka shelters in Madhya Pradesh contain one of the longest continuous records of painting anywhere — layers spanning from the Mesolithic into the historical period, on rock faces that were inhabited rather than ceremonially visited. Unlike the deep European caves, these are open shelters where people actually lived, and the imagery is correspondingly social: dancers, drummers, hunts, and processions rather than solitary animals.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Bhimbetka_rock_paintng1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Bhimbetka rock shelters",
            "year": "c. 8,000 BCE onward",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Bhimbetka_rock_paintng1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "These shelters were painted continuously for perhaps ten thousand years. In places you can see later horses and riders drawn directly over Stone Age hunters.",
            "sourceCredit": "Bhimbetka, Madhya Pradesh — UNESCO World Heritage Site",
            "sourceLink": "https://whc.unesco.org/en/list/925/"
          }
        ]
      }
    ]
  },
  {
    "id": "classical",
    "name": "Ancient & Classical",
    "shortName": "Classical",
    "yearRange": "3,000 BCE – 400 CE",
    "tagline": "The invention of the ideal",
    "description": "Egypt held one style almost unchanged for three thousand years. Then Greek sculptors did something unprecedented: they studied the living body and carved it as it actually moves — and Rome carried that discovery across an empire.",
    "characteristics": [
      "Idealised anatomy",
      "Contrapposto stance",
      "Marble & bronze",
      "Civic and funerary art"
    ],
    "theme": {
      "accent": "#eab308",
      "gradientFrom": "#713f12",
      "gradientTo": "#0a0a05",
      "glow": "rgba(234, 179, 8, 0.28)"
    },
    "heroArtwork": {
      "title": "Bust of Nefertiti",
      "artist": "Thutmose",
      "year": "c. 1345 BCE",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/46/Nefertiti_30-01-2006.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
      "placeholderUrl": "/placeholder-hero-classical.jpg",
      "sourceCredit": "Neues Museum, Berlin",
      "sourceLink": "https://www.smb.museum/en/museums-institutions/neues-museum/home/",
      "factoid": "The bust was found in a sculptor's abandoned workshop in 1912, still in his studio — it was never a finished commission but a master model, kept for other artisans to copy. Its left eye was never inlaid."
    },
    "deepDive": {
      "essay": [
        "Egyptian art is often called static, which misreads it. It was deliberately, ideologically constant: an image of a pharaoh was not a portrait but a functioning object, meant to guarantee an afterlife. Changing the formula would have risked the outcome. The result is a visual language that stayed legible for three millennia — longer than the gap between us and Rome.",
        "Greece broke it. In the space of about a century, from roughly 600 to 480 BCE, Greek sculpture went from rigid frontal figures borrowed from Egypt to the Doryphoros — a man standing with his weight on one leg, hip dropped, shoulders counter-tilted. That pose, contrapposto, is the single most consequential discovery in the history of Western sculpture. It made stone look like it was about to move.",
        "Rome then did something the Greeks had not: individual faces. Roman portrait busts record receding hairlines, warts, and sagging jowls with a bluntness that would not reappear for over a thousand years. The empire copied Greek bodies wholesale — most \"Greek\" statues we have are Roman marble copies of lost bronzes — but it attached its own unflattering heads."
      ],
      "moments": [
        {
          "year": "c. 2560 BCE",
          "title": "The Great Sphinx",
          "detail": "Carved from a single limestone outcrop on the Giza plateau, the largest monolithic statue ever made.",
          "anchorWork": "The Great Sphinx of Giza"
        },
        {
          "year": "c. 1345 BCE",
          "title": "The Amarna experiment",
          "detail": "Akhenaten's brief religious revolution produces a startlingly naturalistic court style — including the Nefertiti bust — before being erased by his successors.",
          "anchorWork": "Bust of Nefertiti"
        },
        {
          "year": "c. 480 BCE",
          "title": "Contrapposto",
          "detail": "Greek sculptors work out how to distribute weight through a standing figure. Statues stop standing to attention and start inhabiting space.",
          "anchorWork": "Doryphoros (Spear-Bearer)"
        },
        {
          "year": "c. 440 BCE",
          "title": "The Parthenon",
          "detail": "Phidias oversees the sculptural programme of the Athenian Acropolis — the high-water mark of the classical style.",
          "anchorWork": "The Parthenon Frieze (Cavalcade)"
        },
        {
          "year": "c. 20 BCE",
          "title": "Augustus of Prima Porta",
          "detail": "Rome fuses Greek idealised anatomy with imperial propaganda: a portrait of a real ruler on the body of a god.",
          "anchorWork": "Augustus of Prima Porta"
        },
        {
          "year": "c. 100–300 CE",
          "title": "The Fayum portraits",
          "detail": "Encaustic panel portraits attached to Egyptian mummies produce the most lifelike faces to survive from the ancient world.",
          "anchorWork": "Fayum Mummy Portrait"
        }
      ],
      "lookFor": [
        {
          "label": "Where the weight sits",
          "detail": "Egyptian figures stand square on both feet. Greek figures after 480 BCE put weight on one leg — find the dropped hip and you have found the revolution."
        },
        {
          "label": "Copies of lost bronzes",
          "detail": "Most surviving \"Greek\" statues are Roman marble copies. The tree stumps and struts propping up limbs are structural additions the bronze original never needed."
        },
        {
          "label": "Idealised body, real face",
          "detail": "Roman imperial portraits routinely graft a specific, aging, recognisable head onto a perfect young body."
        },
        {
          "label": "Missing paint",
          "detail": "Classical marble was brightly painted. The austere white we admire is the accident of pigment weathering away."
        }
      ],
      "legacy": "When the Renaissance dug these statues out of Italian soil fifteen centuries later, it did not treat them as history. It treated them as instructions."
    },
    "keyArtists": [
      {
        "name": "Thutmose",
        "years": "fl. c. 1350 BCE",
        "nationality": "Egyptian",
        "epithet": "Court sculptor at Amarna",
        "bio": "Chief sculptor to Akhenaten, whose Amarna workshop was found intact with plaster study heads still on the shelves.",
        "longBio": "Thutmose is one of the very few Egyptian artists whose name and studio we can both identify. Excavators in 1912 found his workshop at Amarna abandoned mid-use, containing unfinished pieces, plaster casts taken from life, and the Nefertiti bust itself. The finds show a working method — study from life, then idealise — that looks startlingly modern, and belongs to a brief period when Egyptian art relaxed its ancient conventions.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/4/46/Nefertiti_30-01-2006.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Bust of Nefertiti",
            "year": "c. 1345 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/46/Nefertiti_30-01-2006.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "The left eye was never inlaid. Because the bust was a workshop master model rather than a commission, it was never meant to be finished.",
            "sourceCredit": "Neues Museum, Berlin",
            "sourceLink": "https://www.smb.museum/en/museums-institutions/neues-museum/home/"
          }
        ]
      },
      {
        "name": "The Giza Sculptors",
        "years": "c. 2560 BCE",
        "nationality": "Egyptian, Old Kingdom",
        "epithet": "Builders of the Sphinx",
        "bio": "Anonymous Old Kingdom workers who carved the largest monolithic statue in the world out of a single limestone ridge.",
        "longBio": "The Great Sphinx was not assembled from blocks — it was quarried down into, cut from the living bedrock of the Giza plateau. The stone removed to free it went into the adjacent temple. The face has been eroded, defaced and repaired repeatedly over 4,500 years, and its missing nose was already gone long before Napoleon's troops, who are blamed for it without evidence.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Great_Sphinx_of_Giza_-_20080716a.jpg/960px-Great_Sphinx_of_Giza_-_20080716a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Great Sphinx of Giza",
            "year": "c. 2560 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Great_Sphinx_of_Giza_-_20080716a.jpg/960px-Great_Sphinx_of_Giza_-_20080716a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "It was carved downward into the bedrock rather than built up, and spent much of antiquity buried to the neck in sand — which is precisely why the body survived better than the head.",
            "sourceCredit": "Giza Plateau, Egypt",
            "sourceLink": "https://whc.unesco.org/en/list/86/"
          },
          {
            "title": "Mask of Tutankhamun",
            "year": "c. 1323 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Golden_Mask_of_Tutankhamu00_%285%29.jpg/960px-Golden_Mask_of_Tutankhamu00_%285%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Eleven kilograms of solid gold. Analysis suggests the cartouche was recut — the mask may have been made for someone else and repurposed when the boy king died unexpectedly.",
            "sourceCredit": "Egyptian Museum, Cairo",
            "sourceLink": "https://egymonuments.gov.eg/museums/the-egyptian-museum-in-cairo/"
          }
        ]
      },
      {
        "name": "Polykleitos",
        "years": "fl. c. 450–420 BCE",
        "nationality": "Greek (Argos)",
        "epithet": "Author of the Canon",
        "bio": "He wrote a treatise defining the ideal proportions of the human body, then sculpted the Doryphoros to demonstrate it.",
        "longBio": "Polykleitos did something no artist had done before: he set out the mathematics of a perfect body in writing, and then produced a statue as the proof. The treatise is lost; the statue survives in Roman copies. Its influence is hard to overstate — for centuries afterwards, \"correct\" proportion in Western art meant Polykleitan proportion. The pose he settled on, with weight shifted onto one leg and the body answering in opposed diagonals, became the default way to stand in Western sculpture.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Doryphoros_MAN_Napoli_Inv6011-2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Doryphoros (Spear-Bearer)",
            "year": "c. 440 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Doryphoros_MAN_Napoli_Inv6011-2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "The original bronze is lost. Every version we have is a Roman marble copy — and the tree-stump support at the leg is a copyist's structural necessity that the bronze never required.",
            "sourceCredit": "Museo Archeologico Nazionale, Naples",
            "sourceLink": "https://mann-napoli.it/en/"
          }
        ]
      },
      {
        "name": "Myron",
        "years": "fl. c. 480–440 BCE",
        "nationality": "Greek (Eleutherae)",
        "epithet": "Sculptor of the frozen instant",
        "bio": "His Discobolus caught an athlete at the coiled moment before release — the first great attempt to sculpt an action rather than a pose.",
        "longBio": "Myron worked in bronze and specialised in bodies under strain. The Discobolus is his most famous solution to a hard problem: how to represent motion in a static medium. He chose the instant of maximum tension, the split second when the discus is fully wound back and about to fly. Anatomically the pose is not quite possible to hold, which is the point — the viewer supplies the movement.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Discobolus_in_National_Roman_Museum_Palazzo_Massimo_alle_Terme.JPG/960px-Discobolus_in_National_Roman_Museum_Palazzo_Massimo_alle_Terme.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Discobolus (Discus Thrower)",
            "year": "c. 450 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Discobolus_in_National_Roman_Museum_Palazzo_Massimo_alle_Terme.JPG/960px-Discobolus_in_National_Roman_Museum_Palazzo_Massimo_alle_Terme.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "No athlete could actually throw from this position — Myron compressed the whole motion into one impossible instant so the eye completes it.",
            "sourceCredit": "Palazzo Massimo alle Terme, Rome",
            "sourceLink": "https://museonazionaleromano.beniculturali.it/en/"
          }
        ]
      },
      {
        "name": "Phidias",
        "years": "c. 480 – 430 BCE",
        "nationality": "Greek (Athens)",
        "epithet": "Director of the Parthenon",
        "bio": "He oversaw the sculptural programme of the Parthenon and made the colossal gold-and-ivory Athena and Zeus, both long lost.",
        "longBio": "Phidias was less a lone carver than the artistic director of Periclean Athens, coordinating the vast sculptural scheme of the Parthenon. His two most celebrated works — the Athena Parthenos and the Zeus at Olympia, one of the Seven Wonders — were chryselephantine, built of gold and ivory over a wooden core, and both are entirely lost. He was later prosecuted, apparently on a charge of embezzling gold intended for the Athena.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Cavalcade_frieze_Parthenon_BM.jpg/960px-Cavalcade_frieze_Parthenon_BM.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Parthenon Frieze (Cavalcade)",
            "year": "c. 440 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Cavalcade_frieze_Parthenon_BM.jpg/960px-Cavalcade_frieze_Parthenon_BM.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The frieze ran 160 metres around the building, mostly in shadow and barely visible from the ground — extraordinary craftsmanship made for a view almost no one had.",
            "sourceCredit": "British Museum, London — contested; Greece seeks return to Athens",
            "sourceLink": "https://www.britishmuseum.org/collection"
          },
          {
            "title": "Two Horsemen, South Frieze",
            "year": "c. 440 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Two_horsemen_South_Frieze_Parthenon.jpg/960px-Two_horsemen_South_Frieze_Parthenon.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The carving is deepest at the top and shallowest at the bottom, correcting for the sharp upward viewing angle — an optical adjustment worked into the stone.",
            "sourceCredit": "British Museum, London — contested; Greece seeks return to Athens",
            "sourceLink": "https://www.britishmuseum.org/collection"
          }
        ]
      },
      {
        "name": "The Hellenistic Masters",
        "years": "c. 200 – 50 BCE",
        "nationality": "Greek",
        "epithet": "Drama over restraint",
        "bio": "Later Greek sculptors abandoned classical calm for extremity — writhing bodies, wind-whipped drapery, faces contorted in agony.",
        "longBio": "After Alexander, Greek art traded the serene balance of the classical period for theatre. The Laocoön knots three bodies into a single struggling mass; the Winged Victory leans into a headwind that presses her clothing flat against her. These works aim squarely at the emotions, and when they resurfaced in Renaissance Italy they hit exactly that mark: Michelangelo was present at the excavation of the Laocoön in 1506, and its influence runs straight through his later work.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Laocoon_Pio-Clementino_Inv1059-1064-1067.jpg/960px-Laocoon_Pio-Clementino_Inv1059-1064-1067.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Laocoön and His Sons",
            "year": "c. 200 BCE – 70 CE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Laocoon_Pio-Clementino_Inv1059-1064-1067.jpg/960px-Laocoon_Pio-Clementino_Inv1059-1064-1067.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Michelangelo was called to the excavation the day it was dug up in 1506. The missing right arm was restored straight and heroic for centuries — until the real arm was found in a Roman builder's yard in 1906, bent sharply back.",
            "sourceCredit": "Vatican Museums, Rome",
            "sourceLink": "https://www.museivaticani.va/content/museivaticani/en.html"
          },
          {
            "title": "Winged Victory of Samothrace",
            "year": "c. 190 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Winged_Victory_of_Samothrace_%281%29.jpg/960px-Winged_Victory_of_Samothrace_%281%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "She was designed to stand in a fountain basin above a ship's prow, so running water and sea wind were part of the sculpture. The head has never been found.",
            "sourceCredit": "Musée du Louvre, Paris",
            "sourceLink": "https://www.louvre.fr/en"
          },
          {
            "title": "Venus de Milo",
            "year": "c. 130 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Venus_de_Milo_Louvre_Ma399_n4.jpg/960px-Venus_de_Milo_Louvre_Ma399_n4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Found by a farmer on Milos in 1820 with fragments of an arm nearby. The Louvre chose to display her armless rather than risk a restoration that might be wrong.",
            "sourceCredit": "Musée du Louvre, Paris",
            "sourceLink": "https://www.louvre.fr/en"
          }
        ]
      },
      {
        "name": "Roman Imperial Workshops",
        "years": "c. 50 BCE – 300 CE",
        "nationality": "Roman",
        "epithet": "Propaganda in marble, faces in wax",
        "bio": "Rome mass-produced imperial images across the empire, and buried its dead behind the most lifelike portraits of the ancient world.",
        "longBio": "Roman portraiture pulls in two directions at once. Official statues like the Augustus of Prima Porta borrow Greek idealised anatomy to make a political argument — this ruler is godlike, eternally young. Meanwhile, the Fayum mummy portraits from Roman Egypt, painted in coloured wax on wooden panels, look startlingly like specific people you might pass in a street: tired eyes, uneven features, individual hair. They are the closest thing the ancient world produced to photography.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Augustus_of_Prima_Porta_%28inv._2290%29.jpg/960px-Augustus_of_Prima_Porta_%28inv._2290%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Augustus of Prima Porta",
            "year": "c. 20 BCE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Augustus_of_Prima_Porta_%28inv._2290%29.jpg/960px-Augustus_of_Prima_Porta_%28inv._2290%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Augustus was in his seventies when versions of this were still being carved, and is shown eternally about thirty. He is also barefoot — a convention reserved for gods.",
            "sourceCredit": "Vatican Museums, Rome",
            "sourceLink": "https://www.museivaticani.va/content/museivaticani/en.html"
          },
          {
            "title": "Fayum Mummy Portrait",
            "year": "c. 100–200 CE",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Fayum-05.jpg/960px-Fayum-05.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Painted in pigmented beeswax and bound to the face of the mummy. Because they were sealed in dry Egyptian tombs, these are the best-preserved painted portraits from antiquity.",
            "sourceCredit": "Roman Egypt — examples in the British Museum and the Louvre",
            "sourceLink": "https://www.britishmuseum.org/collection"
          }
        ]
      }
    ]
  },
  {
    "id": "medieval",
    "name": "Medieval Art",
    "shortName": "Medieval",
    "yearRange": "400 – 1400 CE",
    "tagline": "Gold ground and the weight of heaven",
    "description": "For a thousand years European art served the church, and had no interest in the world as the eye sees it. Space is gold, scale means importance, and the goal is not to depict a body but to open a window onto something outside time.",
    "characteristics": [
      "Gold leaf grounds",
      "Hierarchical scale",
      "Illuminated manuscripts",
      "Icon tradition"
    ],
    "theme": {
      "accent": "#c084fc",
      "gradientFrom": "#4c1d95",
      "gradientTo": "#0a0612",
      "glow": "rgba(192, 132, 252, 0.28)"
    },
    "heroArtwork": {
      "title": "The Trinity",
      "artist": "Andrei Rublev",
      "year": "c. 1411",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Angelsatmamre-trinity-rublev-1410.jpg/960px-Angelsatmamre-trinity-rublev-1410.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "placeholderUrl": "/placeholder-hero-medieval.jpg",
      "sourceCredit": "Tretyakov Gallery, Moscow",
      "sourceLink": "https://www.tretyakovgallery.ru/en/",
      "factoid": "Three angels sit around a table, and the empty near side of that table is deliberate — the composition leaves a place open, positioning the viewer as the fourth guest."
    },
    "deepDive": {
      "essay": [
        "Medieval art is routinely described as a decline from classical naturalism, as though its makers were trying to draw like the Greeks and failing. They were not trying. The aims had changed completely.",
        "An icon or an altarpiece is not a picture of an event; it is closer to a devotional instrument. Gold behind a figure is not a wall or a sky — it is the absence of ordinary space, deliberately unreadable, signalling that what you are looking at is not happening anywhere. Figures are sized by spiritual importance rather than distance. None of this is incompetence; it is a different set of rules, applied with total consistency for a thousand years.",
        "Then, around 1300, Giotto started painting people who have weight. His figures occupy real space, cast shadows, turn their backs to the viewer, and grieve in recognisable human ways. It is the hinge on which the entire following era turns — everything in the Renaissance section of this timeline begins with what Giotto worked out on the walls of a chapel in Padua."
      ],
      "moments": [
        {
          "year": "c. 547",
          "title": "Ravenna mosaics",
          "detail": "The San Vitale mosaics fix the Byzantine imperial style: frontal, weightless, set against shimmering gold tesserae.",
          "anchorWork": "Emperor Justinian and His Court"
        },
        {
          "year": "c. 800",
          "title": "The Book of Kells",
          "detail": "Irish monks produce an illuminated gospel book of obsessive intricacy, with initials that dissolve into interlaced animals.",
          "anchorWork": "Book of Kells, Chi Rho page"
        },
        {
          "year": "1077",
          "title": "The Bayeux Tapestry",
          "detail": "Seventy metres of embroidered narrative record the Norman conquest — secular storytelling on an epic scale.",
          "anchorWork": "The Death of Harold"
        },
        {
          "year": "c. 1280",
          "title": "Cimabue and Duccio",
          "detail": "Italian panel painters begin softening Byzantine rigidity, giving the Virgin a hint of physical presence.",
          "anchorWork": "Maestà (Santa Trinita)"
        },
        {
          "year": "c. 1305",
          "title": "The Scrovegni Chapel",
          "detail": "Giotto frescoes a Paduan chapel with figures that have volume and emotion. Western painting changes direction.",
          "anchorWork": "The Lamentation"
        },
        {
          "year": "c. 1412",
          "title": "Les Très Riches Heures",
          "detail": "The Limbourg brothers illuminate a book of hours whose calendar pages record real landscape, weather and labour.",
          "anchorWork": "Les Très Riches Heures: June"
        }
      ],
      "lookFor": [
        {
          "label": "Gold means \"not here\"",
          "detail": "A gold ground is not a background. It removes the scene from physical space and time altogether."
        },
        {
          "label": "Size equals status",
          "detail": "Christ and the Virgin are larger than saints, who are larger than donors. Scale is theology, not perspective."
        },
        {
          "label": "The reversed perspective of icons",
          "detail": "Lines often widen as they recede, as if the vanishing point sits behind the viewer — the image looks out at you rather than you into it."
        },
        {
          "label": "Giotto's shadows",
          "detail": "Where you first see cast shadow, drapery with real folds, and figures seen from behind, you are watching the medieval system break."
        }
      ],
      "legacy": "The gold ground did not vanish so much as get pushed back — replaced first by Giotto's solid bodies, then by the deep landscapes the Renaissance opened up behind them."
    },
    "keyArtists": [
      {
        "name": "Andrei Rublev",
        "years": "c. 1360 – 1430",
        "nationality": "Russian",
        "epithet": "The greatest of the icon painters",
        "bio": "A monk whose Trinity is regarded as the summit of Russian icon painting — and who was himself later canonised.",
        "longBio": "Almost nothing is documented about Rublev's life beyond a handful of chronicle entries. What survives is the work, and above all the Trinity, painted for the Trinity Lavra of St Sergius. Where earlier treatments of the subject crowded in Abraham, Sarah and a slaughtered calf, Rublev stripped everything away to three angels and a cup, arranged in a circle of inclined heads. The Russian Orthodox Church canonised him in 1988.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fc/Andrei_Rublev_%28miniature%2C_16_c%29_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "The Trinity",
            "year": "c. 1411",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Angelsatmamre-trinity-rublev-1410.jpg/960px-Angelsatmamre-trinity-rublev-1410.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The three angels' heads incline into a circle, and the near side of the table is left empty — the viewer is meant to occupy the fourth seat.",
            "sourceCredit": "Tretyakov Gallery, Moscow",
            "sourceLink": "https://www.tretyakovgallery.ru/en/"
          }
        ]
      },
      {
        "name": "The Byzantine Icon Painters",
        "years": "c. 500 – 1400",
        "nationality": "Byzantine",
        "epithet": "A thousand years of the same face",
        "bio": "Anonymous painters who maintained an image tradition so stable that a 6th-century Christ and a 14th-century one are recognisably the same person.",
        "longBio": "Byzantine icon painting was governed by inherited patterns rather than invention: the point was fidelity to a received image, not originality. The Christ Pantocrator at Saint Catherine's Monastery in Sinai, painted in encaustic in the 6th century, survived the iconoclastic purges precisely because Sinai lay outside imperial control. Its two halves are famously asymmetric — cover one side, then the other, and you get two quite different expressions.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Spas_vsederzhitel_sinay.jpg/960px-Spas_vsederzhitel_sinay.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Christ Pantocrator of Sinai",
            "year": "c. 550",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Spas_vsederzhitel_sinay.jpg/960px-Spas_vsederzhitel_sinay.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The two halves of the face do not match: one side is serene, the other stern. Cover each in turn and you see two different Christs — mercy and judgement in one panel.",
            "sourceCredit": "Saint Catherine's Monastery, Sinai",
            "sourceLink": "https://www.sinaimonastery.com/"
          },
          {
            "title": "Emperor Justinian and His Court",
            "year": "c. 547",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Meister_von_San_Vitale_in_Ravenna.jpg/960px-Meister_von_San_Vitale_in_Ravenna.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The tesserae are set at deliberately irregular angles so that candlelight never reflects off the whole surface at once — the gold appears to move.",
            "sourceCredit": "Basilica of San Vitale, Ravenna",
            "sourceLink": "https://whc.unesco.org/en/list/788/"
          }
        ]
      },
      {
        "name": "Giotto di Bondone",
        "years": "c. 1267 – 1337",
        "nationality": "Italian (Florence)",
        "epithet": "The man who gave figures weight",
        "bio": "He broke a thousand years of convention by painting people who occupy space, feel gravity, and grieve like human beings.",
        "longBio": "Giotto's frescoes in the Scrovegni Chapel in Padua are the pivot of Western painting. His figures are solid, wrapped in drapery that falls under its own weight; they turn away from the viewer, huddle, slump. In the Lamentation, the mourners' grief is physical — one figure throws her arms back, and the angels above contort in a way no Byzantine angel ever would. Vasari, writing two centuries later, credited him with restoring painting to life, and the judgement has stuck.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Giotto_di_Bondone_002.jpg/960px-Giotto_di_Bondone_002.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Lamentation",
            "year": "c. 1305",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Giotto_-_Scrovegni_-_-36-_-_Lamentation_%28The_Mourning_of_Christ%29_adj.jpg/960px-Giotto_-_Scrovegni_-_-36-_-_Lamentation_%28The_Mourning_of_Christ%29_adj.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Two mourners in the foreground are seen from behind — faceless, anonymous, blocking our view. Nobody had put the viewer inside a grieving crowd like this before.",
            "sourceCredit": "Scrovegni Chapel, Padua",
            "sourceLink": "https://www.cappelladegliscrovegni.it/index.php/en/"
          }
        ]
      },
      {
        "name": "Duccio di Buoninsegna",
        "years": "c. 1255 – 1319",
        "nationality": "Italian (Siena)",
        "epithet": "Founder of the Sienese school",
        "bio": "His vast Maestà was carried to Siena cathedral in a public procession, with shops shut and bells ringing all day.",
        "longBio": "Duccio took the Byzantine manner and warmed it — softer faces, more supple line, a delicacy that would define Sienese painting for a century. The Maestà was a double-sided altarpiece of enormous ambition, and its installation in 1311 was a civic event: the chronicles describe the whole city processing behind it with candles. It was later sawn apart, and its panels are now scattered between Siena, London, Washington and elsewhere.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Duccio_di_Buoninsegna_003.jpg/960px-Duccio_di_Buoninsegna_003.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Maestà",
            "year": "1308–1311",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Duccio_Maest%C3%A0.jpg/960px-Duccio_Maest%C3%A0.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Siena shut its shops and processed the finished altarpiece through the streets to the cathedral. Centuries later it was sawn into pieces, which now sit in four countries.",
            "sourceCredit": "Museo dell'Opera del Duomo, Siena",
            "sourceLink": "https://operaduomo.siena.it/en/"
          }
        ]
      },
      {
        "name": "Simone Martini",
        "years": "c. 1284 – 1344",
        "nationality": "Italian (Siena)",
        "epithet": "Courtly grace in gold",
        "bio": "A Sienese master whose elegant, linear style carried the International Gothic across Europe from the papal court at Avignon.",
        "longBio": "Simone Martini refined Duccio's manner into something more decorative and aristocratic — long curving lines, rich patterning, exquisitely tooled gold. His Annunciation gives the Virgin a genuinely startled recoil, shrinking from the angel, which is psychologically sharper than almost anything of its date. He spent his last years at Avignon, where he knew Petrarch, and his style spread through Europe from there.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Simone_Martini_003.jpg/960px-Simone_Martini_003.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Annunciation",
            "year": "1333",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Simone_Martini_078.jpg/960px-Simone_Martini_078.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The angel's greeting is embossed in raised letters running physically across the gold surface toward Mary, who twists away from it.",
            "sourceCredit": "Galleria degli Uffizi, Florence",
            "sourceLink": "https://www.uffizi.it/en"
          }
        ]
      },
      {
        "name": "Cimabue",
        "years": "c. 1240 – 1302",
        "nationality": "Italian (Florence)",
        "epithet": "Giotto's teacher, by tradition",
        "bio": "The last great master of the Italo-Byzantine style, and — legend says — the man who discovered Giotto drawing sheep on a rock.",
        "longBio": "Cimabue worked at the very end of the Byzantine tradition in Italy, and pushed at its limits: his Virgins have a monumental scale and the beginnings of real modelling in the face. Dante placed him in the Purgatorio as the example of superseded fame — Cimabue thought he held the field, and now Giotto has the cry. His Crucifix in Santa Croce was catastrophically damaged in the 1966 Florence flood and became the emblem of that disaster.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cimabue_001.jpg/960px-Cimabue_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Maestà (Santa Trinita)",
            "year": "c. 1280",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Cimabue_025.jpg/960px-Cimabue_025.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Dante used Cimabue as his example of fame overtaken: he \"thought to hold the field in painting, and now Giotto has the cry\".",
            "sourceCredit": "Galleria degli Uffizi, Florence",
            "sourceLink": "https://www.uffizi.it/en"
          }
        ]
      },
      {
        "name": "The Limbourg Brothers",
        "years": "fl. c. 1402 – 1416",
        "nationality": "Netherlandish",
        "epithet": "Illuminators of the Très Riches Heures",
        "bio": "Three brothers whose calendar pages record real châteaux, real weather and real peasant labour with unprecedented specificity.",
        "longBio": "Herman, Paul and Johan Limbourg worked for Jean, Duc de Berry, on a book of hours of extraordinary luxury. The calendar cycle is the famous part: each month gets a full-page miniature showing a season's work beneath an identifiable ducal castle, painted with ultramarine ground from lapis lazuli imported from Afghanistan. All three brothers and their patron died in 1416, probably of plague, leaving the book unfinished; it was completed decades later.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Les_Tr%C3%A8s_Riches_Heures_du_duc_de_Berry_juin.jpg/960px-Les_Tr%C3%A8s_Riches_Heures_du_duc_de_Berry_juin.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Les Très Riches Heures: June",
            "year": "c. 1412–1416",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Les_Tr%C3%A8s_Riches_Heures_du_duc_de_Berry_juin.jpg/960px-Les_Tr%C3%A8s_Riches_Heures_du_duc_de_Berry_juin.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The blue is ground lapis lazuli, carried overland from Afghanistan and at the time worth more by weight than gold.",
            "sourceCredit": "Musée Condé, Chantilly",
            "sourceLink": "https://www.chateaudechantilly.fr/en/"
          }
        ]
      },
      {
        "name": "The Insular Scribes",
        "years": "c. 700 – 900",
        "nationality": "Irish & Northumbrian",
        "epithet": "Monks of the interlaced page",
        "bio": "Monastic scribes whose gospel books turn letters into labyrinths of interlace, spirals and hidden animals.",
        "longBio": "The Book of Kells is the most elaborate survivor of a monastic tradition that treated the written word as sacred object. Its decoration is dense past the point of legibility — the Chi Rho page devotes an entire folio to the first two letters of Christ's name, filled with spirals so fine that some details are only a few millimetres across, alongside cats, mice and an otter. Gerald of Wales, seeing a comparable book in the 12th century, concluded it was the work of angels.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/9/98/Book_of_Kells_ChiRho_Folio_34R.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Book of Kells, Chi Rho page",
            "year": "c. 800",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/98/Book_of_Kells_ChiRho_Folio_34R.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "Hidden in the ornament are two cats watching mice steal a communion wafer, and an otter with a fish — jokes buried in a sacred page.",
            "sourceCredit": "Trinity College Library, Dublin",
            "sourceLink": "https://www.tcd.ie/library/manuscripts/book-of-kells.php"
          }
        ]
      },
      {
        "name": "The Bayeux Embroiderers",
        "years": "c. 1077",
        "nationality": "Anglo-Saxon (probably Kent)",
        "epithet": "Seventy metres of conquest",
        "bio": "Anonymous needleworkers — probably English women — who stitched the Norman victory that had just defeated their own country.",
        "longBio": "The Bayeux Tapestry is not a tapestry but wool embroidery on linen, nearly seventy metres long, narrating the Norman conquest of England in continuous strip form. The likeliest origin is an English workshop in Kent, working for a Norman patron — meaning the conquered stitched the conqueror's version of events. The margins carry a running commentary of animals, fables and, in places, obscenities that have little to do with the main narrative.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Bayeux_Tapestry_scene57_Harold_death.jpg/960px-Bayeux_Tapestry_scene57_Harold_death.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Death of Harold",
            "year": "c. 1077",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Bayeux_Tapestry_scene57_Harold_death.jpg/960px-Bayeux_Tapestry_scene57_Harold_death.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Whether the arrow-in-the-eye figure is actually Harold has been argued for two centuries — and 19th-century restorers may have altered the stitching that would settle it.",
            "sourceCredit": "Musée de la Tapisserie de Bayeux",
            "sourceLink": "https://www.bayeuxmuseum.com/en/"
          }
        ]
      }
    ]
  },
  {
    "id": "renaissance",
    "name": "The Renaissance",
    "shortName": "Renaissance",
    "yearRange": "1400 – 1600",
    "tagline": "Man measures the world",
    "description": "Linear perspective gave painters a mathematical method for putting three dimensions on a flat panel. Combined with dissection, oil paint and the recovery of classical texts, it produced a century in which artists became the most celebrated people in Europe.",
    "characteristics": [
      "Linear perspective",
      "Anatomical study",
      "Oil on panel & canvas",
      "Classical revival"
    ],
    "theme": {
      "accent": "#34d399",
      "gradientFrom": "#065f46",
      "gradientTo": "#04100c",
      "glow": "rgba(52, 211, 153, 0.28)"
    },
    "heroArtwork": {
      "title": "Mona Lisa",
      "artist": "Leonardo da Vinci",
      "year": "c. 1503–1519",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Leonardo_da_Vinci_-_Mona_Lisa_%28La_Gioconda%29_-_WGA12711.jpg/960px-Leonardo_da_Vinci_-_Mona_Lisa_%28La_Gioconda%29_-_WGA12711.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "placeholderUrl": "/placeholder-hero-renaissance.jpg",
      "sourceCredit": "Musée du Louvre, Paris",
      "sourceLink": "https://collections.louvre.fr/en/ark:/53355/cl010062370",
      "factoid": "She was a moderately known picture until 1911, when a Louvre handyman walked out with her under his coat. The two-year manhunt, and the crowds who queued to see the empty wall, made her the most famous painting on earth."
    },
    "deepDive": {
      "essay": [
        "Around 1420, an architect in Florence worked out that if you construct receding lines so they converge on a single point, a flat surface will read as deep space. Brunelleschi's discovery of linear perspective was a geometric technique, but its consequences were philosophical: it put a single human eye at the organising centre of the picture.",
        "Everything else compounded it. Oil paint, refined in the Netherlands, dried slowly enough to blend imperceptibly and could be layered in transparent glazes, making possible a depth of colour tempera never had. Dissection — illegal, and practised anyway — let artists build figures from the skeleton outward. And the recovery of Greek and Roman texts supplied both subject matter and the argument that human achievement was worth depicting at all.",
        "The social change was as sharp as the technical one. Medieval painters were craftsmen in guilds, often anonymous. Within a century artists were signing work, writing treatises, arguing with popes and being buried with public honours. Michelangelo had two biographies published while he was still alive. That shift — from tradesman to genius — is itself a Renaissance invention, and we still live inside it."
      ],
      "moments": [
        {
          "year": "c. 1420",
          "title": "Perspective is solved",
          "detail": "Brunelleschi demonstrates linear perspective in Florence; Alberti writes it down in 1435 so anyone can use it."
        },
        {
          "year": "1434",
          "title": "The Arnolfini Portrait",
          "detail": "Van Eyck shows what oil paint can do — a convex mirror reflecting the whole room, and a signature on the wall.",
          "anchorWork": "The Arnolfini Portrait"
        },
        {
          "year": "c. 1486",
          "title": "The Birth of Venus",
          "detail": "Botticelli paints a monumental pagan nude for a Medici patron, unthinkable a century earlier.",
          "anchorWork": "The Birth of Venus"
        },
        {
          "year": "1498",
          "title": "The Last Supper completed",
          "detail": "Leonardo finishes his Milan mural — and it begins deteriorating almost immediately because of his experimental technique.",
          "anchorWork": "The Last Supper"
        },
        {
          "year": "1508–1512",
          "title": "The Sistine Ceiling",
          "detail": "Michelangelo, who insisted he was a sculptor and not a painter, spends four years on his back under a ceiling.",
          "anchorWork": "The Creation of Adam"
        },
        {
          "year": "1506",
          "title": "The Laocoön unearthed",
          "detail": "A Hellenistic masterpiece is dug up in Rome. Michelangelo attends the excavation; ancient sculpture becomes a living influence again."
        }
      ],
      "lookFor": [
        {
          "label": "Find the vanishing point",
          "detail": "Follow the receding lines — floor tiles, ceiling beams, architecture. Where they converge is usually the theological or dramatic heart of the picture."
        },
        {
          "label": "Sfumato",
          "detail": "Leonardo's smoky transitions with no visible outline, built from dozens of translucent glazes. It is why the Mona Lisa's expression seems to shift."
        },
        {
          "label": "Contrapposto returns",
          "detail": "The classical weight-on-one-leg stance comes back, now understood anatomically rather than copied."
        },
        {
          "label": "Donors in the corner",
          "detail": "The small kneeling figures at the edges are the people who paid. Their scale relative to the saints tells you how the commission was negotiated."
        }
      ],
      "legacy": "The Renaissance settled what a picture was for the next four hundred years: a window, with a vanishing point, onto a convincing world. Every later movement in this timeline is in some sense an argument with that."
    },
    "keyArtists": [
      {
        "name": "Leonardo da Vinci",
        "years": "1452 – 1519",
        "nationality": "Italian",
        "epithet": "Painter, anatomist, engineer",
        "bio": "He finished very few paintings and left thousands of pages of notes on anatomy, flight, hydraulics and optics, written in mirror script.",
        "longBio": "Leonardo was an illegitimate son of a notary, trained in Verrocchio's Florentine workshop, and spent his career moving between Milan, Florence, Rome and finally France. His completed paintings number well under twenty, partly because he was constitutionally unable to stop investigating — he dissected some thirty human bodies, studied the mechanics of water, and designed machines nobody built. The notebooks, written right-to-left in mirror script, run to over 7,000 surviving pages and were unpublished for centuries.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Leonardo_self.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Mona Lisa",
            "year": "c. 1503–1519",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Leonardo_da_Vinci_-_Mona_Lisa_%28La_Gioconda%29_-_WGA12711.jpg/960px-Leonardo_da_Vinci_-_Mona_Lisa_%28La_Gioconda%29_-_WGA12711.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Her fame dates from 1911, when she was stolen by a Louvre employee. Crowds queued for two years to look at the empty space where she had hung.",
            "sourceCredit": "Musée du Louvre, Paris",
            "sourceLink": "https://collections.louvre.fr/en/ark:/53355/cl010062370"
          },
          {
            "title": "The Last Supper",
            "year": "1495–1498",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg/960px-Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Leonardo painted onto dry plaster instead of wet, so it never bonded. It was visibly deteriorating within twenty years and has been restored at least seven times.",
            "sourceCredit": "Santa Maria delle Grazie, Milan",
            "sourceLink": "https://legraziemilano.it/en/"
          },
          {
            "title": "Vitruvian Man",
            "year": "c. 1490",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg/960px-Da_Vinci_Vitruve_Luc_Viatour.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "It is a drawing solving an old geometric puzzle: how one body can fit both a circle and a square. Leonardo shifted the two centres apart to make it work.",
            "sourceCredit": "Gallerie dell'Accademia, Venice",
            "sourceLink": "https://www.gallerieaccademia.it/en"
          },
          {
            "title": "Lady with an Ermine",
            "year": "c. 1489–1491",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Leonardo_da_Vinci_-_Lady_with_an_Ermine.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "The sitter was the teenage mistress of the Duke of Milan. The ermine is a pun — the Greek for the animal, galé, echoes her surname, Gallerani.",
            "sourceCredit": "Czartoryski Museum, Kraków",
            "sourceLink": "https://mnk.pl/branch/the-princes-czartoryski-museum"
          }
        ]
      },
      {
        "name": "Michelangelo Buonarroti",
        "years": "1475 – 1564",
        "nationality": "Italian",
        "epithet": "Sculptor who resented the brush",
        "bio": "He considered himself a sculptor, took the Sistine commission unwillingly, and produced the most famous ceiling in the world.",
        "longBio": "Michelangelo signed himself \"sculptor\" even while painting, and complained bitterly in verse about the physical misery of the Sistine job — neck bent, paint dripping into his eyes, for four years. He was extraordinarily long-lived and productive: he carved the Pietà at 24, the David at 29, painted the ceiling in his thirties, returned to fresco the Last Judgement in his sixties, and was still working as architect of St Peter's when he died at 88.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Miguel_%C3%81ngel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg/960px-Miguel_%C3%81ngel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Creation of Adam",
            "year": "1508–1512",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/960px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The red drapery framing God has been read since the 1990s as an anatomically accurate cross-section of the human brain — plausible, for a man who dissected in secret.",
            "sourceCredit": "Sistine Chapel, Vatican City",
            "sourceLink": "https://www.museivaticani.va/content/museivaticani/en.html"
          },
          {
            "title": "Pietà",
            "year": "1498–1499",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Michelangelo%27s_Pieta_5450_cut_out_black.jpg/960px-Michelangelo%27s_Pieta_5450_cut_out_black.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The only work he ever signed. He carved his name across the Virgin's sash after overhearing someone credit the piece to another sculptor, and reportedly regretted the vanity afterwards.",
            "sourceCredit": "St Peter's Basilica, Vatican City",
            "sourceLink": "https://www.vatican.va/"
          },
          {
            "title": "David",
            "year": "1501–1504",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/%27David%27_by_Michelangelo_Fir_JBU002.jpg/960px-%27David%27_by_Michelangelo_Fir_JBU002.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The marble block had been abandoned as ruined by two earlier sculptors. Michelangelo took the flawed, half-worked stone and got a five-metre figure out of it.",
            "sourceCredit": "Galleria dell'Accademia, Florence",
            "sourceLink": "https://www.galleriaaccademiafirenze.it/en/"
          },
          {
            "title": "The Last Judgement",
            "year": "1536–1541",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Michelangelo%2C_Giudizio_Universale_02.jpg/960px-Michelangelo%2C_Giudizio_Universale_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "A papal official called the nudity obscene; Michelangelo painted him into hell with donkey ears and a serpent. Later popes had loincloths added by another artist.",
            "sourceCredit": "Sistine Chapel, Vatican City",
            "sourceLink": "https://www.museivaticani.va/content/museivaticani/en.html"
          }
        ]
      },
      {
        "name": "Raphael",
        "years": "1483 – 1520",
        "nationality": "Italian",
        "epithet": "The effortless one",
        "bio": "The youngest of the three great masters, famed for grace and clarity, and dead at 37 on what was said to be his birthday.",
        "longBio": "Raphael arrived in Rome as a young man and within a few years was frescoing the papal apartments alongside Michelangelo's Sistine work. Where Michelangelo's figures strain, Raphael's are composed and lucid — the School of Athens organises dozens of philosophers into a space of complete architectural calm. He ran a large and efficient workshop, was appointed architect of St Peter's, and died suddenly at 37; he was buried in the Pantheon.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Raffaello_Sanzio.jpg/960px-Raffaello_Sanzio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The School of Athens",
            "year": "1509–1511",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/960px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The philosophers are portraits of Raphael's contemporaries. Plato is Leonardo; the brooding figure on the steps was added late and is Michelangelo, then at work next door.",
            "sourceCredit": "Vatican Museums, Rome",
            "sourceLink": "https://www.museivaticani.va/content/museivaticani/en.html"
          },
          {
            "title": "Sistine Madonna",
            "year": "1512",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Raffael_058.jpg/960px-Raffael_058.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The two bored cherubs at the bottom edge are a minor detail of a huge altarpiece. Detached and reproduced endlessly since the 19th century, they are now better known than the painting.",
            "sourceCredit": "Gemäldegalerie Alte Meister, Dresden",
            "sourceLink": "https://gemaeldegalerie.skd.museum/en/"
          },
          {
            "title": "The Transfiguration",
            "year": "1516–1520",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Transfiguration_Raphael.jpg/960px-Transfiguration_Raphael.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "His last work, unfinished at his death. It was carried at the head of his funeral procession and hung above his body as he lay in state.",
            "sourceCredit": "Vatican Museums, Rome",
            "sourceLink": "https://www.museivaticani.va/content/museivaticani/en.html"
          }
        ]
      },
      {
        "name": "Sandro Botticelli",
        "years": "c. 1445 – 1510",
        "nationality": "Italian (Florence)",
        "epithet": "Linear grace under Medici patronage",
        "bio": "His mythological paintings for the Medici circle were forgotten for three centuries before the Pre-Raphaelites rediscovered him.",
        "longBio": "Botticelli's great pagan pictures — the Birth of Venus, the Primavera — were painted for private Medici settings and depend on a Neoplatonic philosophy that read classical myth as coded spiritual allegory. Late in life he fell under the influence of the fundamentalist preacher Savonarola, and his work turned harsh and penitential; some accounts say he burned paintings of his own. He died in obscurity, and his reputation was only revived in the 19th century.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sandro_Botticelli_083.jpg/960px-Sandro_Botticelli_083.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Birth of Venus",
            "year": "c. 1486",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/960px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Painted on canvas rather than panel, which was cheap and unusual, and finished with a thin varnish of egg yolk that has kept the colours remarkably bright.",
            "sourceCredit": "Galleria degli Uffizi, Florence",
            "sourceLink": "https://www.uffizi.it/en"
          },
          {
            "title": "Primavera",
            "year": "c. 1480",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Botticelli-primavera.jpg/960px-Botticelli-primavera.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Botanists have identified around 190 distinct plant species in the meadow, most of them flowering in the actual Tuscan spring.",
            "sourceCredit": "Galleria degli Uffizi, Florence",
            "sourceLink": "https://www.uffizi.it/en"
          }
        ]
      },
      {
        "name": "Jan van Eyck",
        "years": "c. 1390 – 1441",
        "nationality": "Netherlandish",
        "epithet": "Master of the oil glaze",
        "bio": "He did not invent oil paint, but he showed Europe what it could do — detail and depth of colour nobody had achieved before.",
        "longBio": "Van Eyck worked for Philip the Good of Burgundy and painted with a precision that still looks unreasonable: individual hairs, the reflection of a window in a pupil, the pile of a carpet. His method built up many thin transparent glazes so light passes through the layers and bounces back off the ground, producing a glow that opaque paint cannot. The Ghent Altarpiece, made with his brother Hubert, is among the most stolen artworks in history — one panel taken in 1934 has never been recovered.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Portrait_of_a_Man_in_a_Turban_%28Jan_van_Eyck%29_with_frame.jpg/960px-Portrait_of_a_Man_in_a_Turban_%28Jan_van_Eyck%29_with_frame.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Arnolfini Portrait",
            "year": "1434",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Van_Eyck_-_Arnolfini_Portrait.jpg/960px-Van_Eyck_-_Arnolfini_Portrait.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The convex mirror on the back wall reflects the whole room including two figures standing where we stand — and above it Van Eyck wrote \"Jan van Eyck was here\".",
            "sourceCredit": "The National Gallery, London",
            "sourceLink": "https://www.nationalgallery.org.uk/paintings/jan-van-eyck-the-arnolfini-portrait"
          },
          {
            "title": "The Ghent Altarpiece",
            "year": "1432",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/25/Retable_de_l%27Agneau_mystique_%282%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "It has been stolen or looted at least a dozen times, including by Napoleon and by the Nazis. One panel taken in 1934 is still missing.",
            "sourceCredit": "Saint Bavo's Cathedral, Ghent",
            "sourceLink": "https://www.sintbaafskathedraal.be/en/"
          }
        ]
      },
      {
        "name": "Albrecht Dürer",
        "years": "1471 – 1528",
        "nationality": "German",
        "epithet": "The printmaker who conquered Europe",
        "bio": "His engravings and woodcuts spread across the continent as reproducible images — the first artist to build an international reputation through print.",
        "longBio": "Dürer understood something his Italian contemporaries did not: a printing plate makes an image that travels. His engravings circulated across Europe in numbers no painting could match, and he pursued forgers through the Venetian courts in one of the earliest copyright actions. He was also an obsessive self-portraitist — the 1500 panel presents him frontally, in the pose reserved for images of Christ, at the age of 28.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Albrecht_D%C3%BCrer_-_1500_self-portrait_%28High_resolution_and_detail%29.jpg/960px-Albrecht_D%C3%BCrer_-_1500_self-portrait_%28High_resolution_and_detail%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Self-Portrait at 28",
            "year": "1500",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Albrecht_D%C3%BCrer_-_1500_self-portrait_%28High_resolution_and_detail%29.jpg/960px-Albrecht_D%C3%BCrer_-_1500_self-portrait_%28High_resolution_and_detail%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "He painted himself frontal and symmetrical — a composition reserved almost exclusively for Christ. It was an extraordinary claim for a painter to make in 1500.",
            "sourceCredit": "Alte Pinakothek, Munich",
            "sourceLink": "https://www.pinakothek.de/en"
          },
          {
            "title": "Melencolia I",
            "year": "1514",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Albrecht_D%C3%BCrer_-_Melencolia_I_-_Google_Art_Project_%28427760%29.jpg/960px-Albrecht_D%C3%BCrer_-_Melencolia_I_-_Google_Art_Project_%28427760%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The number square on the wall sums to 34 in every row, column and diagonal — and its bottom row reads 15 14, the year he made it.",
            "sourceCredit": "Impressions in the Met and the British Museum",
            "sourceLink": "https://www.metmuseum.org/art/collection"
          }
        ]
      },
      {
        "name": "Titian",
        "years": "c. 1488 – 1576",
        "nationality": "Italian (Venice)",
        "epithet": "Colour over line",
        "bio": "The dominant Venetian painter for sixty years, whose late works dissolve into loose, smeared paint applied partly with his fingers.",
        "longBio": "Titian ran the most successful workshop in Europe and painted for popes, doges and the Emperor Charles V, who is said to have picked up a dropped brush for him. His early work is polished; his late work is startlingly free, built from broken touches and scumbles that only resolve at a distance — a technique that anticipates by three centuries what the Impressionists would be attacked for. He lived into his late eighties and died during a plague outbreak in Venice.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Titian_-_Self-portrait_%28Museo_del_Prado%29.jpg/960px-Titian_-_Self-portrait_%28Museo_del_Prado%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Bacchus and Ariadne",
            "year": "1520–1523",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Titian_-_Bacchus_and_Ariadne_-_Google_Art_Project.jpg/960px-Titian_-_Bacchus_and_Ariadne_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The sky is ultramarine, ground from imported lapis. Titian used it lavishly across a huge area at a point when the pigment cost more than gold.",
            "sourceCredit": "The National Gallery, London",
            "sourceLink": "https://www.nationalgallery.org.uk/paintings/titian-bacchus-and-ariadne"
          },
          {
            "title": "Venus of Urbino",
            "year": "1534",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tizian_041.jpg/960px-Tizian_041.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Mark Twain called it the foulest painting in the world. It was probably made to mark a marriage, with the sleeping dog signifying fidelity.",
            "sourceCredit": "Galleria degli Uffizi, Florence",
            "sourceLink": "https://www.uffizi.it/en"
          }
        ]
      },
      {
        "name": "Pieter Bruegel the Elder",
        "years": "c. 1525 – 1569",
        "nationality": "Netherlandish",
        "epithet": "Painter of the crowd",
        "bio": "He filled panels with peasants, proverbs and vast landscapes in which the nominal subject is often almost invisible.",
        "longBio": "Bruegel was well-educated and worked for sophisticated urban collectors, despite the \"Peasant Bruegel\" nickname. His pictures reward long looking: the Netherlandish Proverbs stages over a hundred sayings simultaneously, and in his Landscape with the Fall of Icarus the drowning boy is a pair of legs in the corner while a ploughman works on, unbothered. That refusal to centre the drama is his signature move.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Pieter_Bruegel_d._%C3%84._049.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "The Tower of Babel",
            "year": "1563",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg/960px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The tower is visibly failing as it rises — the lower arches already tilt out of true, so the collapse is built into the architecture rather than delivered by God.",
            "sourceCredit": "Kunsthistorisches Museum, Vienna",
            "sourceLink": "https://www.khm.at/en/"
          },
          {
            "title": "The Hunters in the Snow",
            "year": "1565",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pieter_Bruegel_d._%C3%84._007.jpg/960px-Pieter_Bruegel_d._%C3%84._007.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Painted during the Little Ice Age, when European winters really were this severe — it is a landscape from a genuinely colder climate.",
            "sourceCredit": "Kunsthistorisches Museum, Vienna",
            "sourceLink": "https://www.khm.at/en/"
          }
        ]
      },
      {
        "name": "Hieronymus Bosch",
        "years": "c. 1450 – 1516",
        "nationality": "Netherlandish",
        "epithet": "Inventor of his own hell",
        "bio": "His triptychs swarm with hybrid creatures and impossible machinery that no source fully explains.",
        "longBio": "Bosch lived his whole life in 's-Hertogenbosch, was a member of a conservative religious brotherhood, and painted images so strange that five centuries of interpretation have not settled them. The Garden of Earthly Delights moves from Eden through a panel of naked figures and outsized fruit into a hell of musical instruments used as torture devices. The Surrealists claimed him as an ancestor; the more likely truth is that he was working from a moral vocabulary we have simply lost.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Portrait_of_Hieronymus_Bosch_attributed_to_Jacques_Le_Boucq_%28Lafond%29.jpg/960px-Portrait_of_Hieronymus_Bosch_attributed_to_Jacques_Le_Boucq_%28Lafond%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Garden of Earthly Delights",
            "year": "c. 1490–1510",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg/960px-The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "In the hell panel a figure has music notated across his backside. Someone transcribed and recorded it in 2014 — it plays as a short, oddly plaintive tune.",
            "sourceCredit": "Museo del Prado, Madrid",
            "sourceLink": "https://www.museodelprado.es/en/the-collection/art-work/the-garden-of-earthly-delights-triptych/02388242-6d6a-4e9e-a992-e1311eab3609"
          }
        ]
      }
    ]
  },
  {
    "id": "baroque",
    "name": "Baroque & Golden Age",
    "shortName": "Baroque",
    "yearRange": "1600 – 1750",
    "tagline": "Light as a weapon",
    "description": "The Counter-Reformation wanted art that overwhelmed, and Caravaggio supplied it: a single hard light source, deep shadow, and saints with dirty feet. In the Dutch Republic the same century produced the opposite — small, quiet pictures of ordinary rooms.",
    "characteristics": [
      "Tenebrism & chiaroscuro",
      "Diagonal drama",
      "Psychological realism",
      "Dutch genre painting"
    ],
    "theme": {
      "accent": "#f87171",
      "gradientFrom": "#7f1d1d",
      "gradientTo": "#0c0505",
      "glow": "rgba(248, 113, 113, 0.28)"
    },
    "heroArtwork": {
      "title": "The Night Watch",
      "artist": "Rembrandt van Rijn",
      "year": "1642",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg/960px-The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "placeholderUrl": "/placeholder-hero-baroque.jpg",
      "sourceCredit": "Rijksmuseum, Amsterdam",
      "sourceLink": "https://www.rijksmuseum.nl/en/collection/SK-C-5",
      "factoid": "It is not a night scene. Centuries of darkened varnish fooled everyone, including whoever named it — cleaning revealed broad daylight. It was also cut down in 1715 to fit a wall, and the missing strips are gone for good."
    },
    "deepDive": {
      "essay": [
        "The Baroque begins as a response to a crisis. The Catholic Church, losing ground to the Reformation, decided at the Council of Trent that religious art should be immediate, emotional and unmistakably clear — not learned puzzles for the educated, but images that would hit an ordinary viewer in the chest.",
        "Caravaggio took that brief further than anyone intended. He lit his scenes like an interrogation, dropped the backgrounds into blackness, and used street people as models — the Virgin's corpse was rumoured to be painted from a drowned prostitute, and one commission was rejected because the apostles' feet were dirty. He also killed a man, fled Rome under a death sentence, and died at 38. His technique spread across Europe within a decade.",
        "The northern Netherlands went the other way entirely. A Protestant republic with no church commissions and a large merchant class produced a market for small secular pictures bought off the wall: landscapes, still lifes, tavern scenes, and rooms with one woman doing one quiet thing near a window. Vermeer, Rembrandt and their contemporaries were painting for buyers, not patrons, and the subject matter reflects it."
      ],
      "moments": [
        {
          "year": "1600",
          "title": "Caravaggio's Contarelli Chapel",
          "detail": "The Calling of St Matthew is unveiled in Rome. Its raking light and street realism make Caravaggio instantly famous and widely imitated.",
          "anchorWork": "The Calling of St Matthew"
        },
        {
          "year": "1610",
          "title": "Caravaggio dies in exile",
          "detail": "Wanted for murder, he dies at 38 on a beach in Tuscany while trying to reach a papal pardon.",
          "anchorWork": "The Incredulity of Saint Thomas"
        },
        {
          "year": "1612",
          "title": "Artemisia's trial",
          "detail": "Artemisia Gentileschi testifies under torture at the trial of her rapist. Her Judith paintings follow.",
          "anchorWork": "Judith Beheading Holofernes (Naples)"
        },
        {
          "year": "1632",
          "title": "The Anatomy Lesson",
          "detail": "A 26-year-old Rembrandt makes his name in Amsterdam with a group portrait built around a dissection.",
          "anchorWork": "The Anatomy Lesson of Dr Nicolaes Tulp"
        },
        {
          "year": "1642",
          "title": "The Night Watch",
          "detail": "Rembrandt turns a static militia portrait into a scene of movement and light — and, tradition wrongly holds, damages his career doing it.",
          "anchorWork": "The Night Watch"
        },
        {
          "year": "c. 1665",
          "title": "Girl with a Pearl Earring",
          "detail": "Vermeer produces a tronie — a study of a type, not a portrait of a person — that becomes one of the most recognisable faces in art.",
          "anchorWork": "Girl with a Pearl Earring"
        }
      ],
      "lookFor": [
        {
          "label": "Where is the light coming from?",
          "detail": "Baroque pictures usually have one hard, identifiable source, often just outside the frame. Trace the shadows back to it."
        },
        {
          "label": "The diagonal",
          "detail": "Renaissance composition is built on stable horizontals and verticals. Baroque runs on diagonals, which is why it feels unstable and in motion."
        },
        {
          "label": "Dirty feet",
          "detail": "Caravaggio and his followers deliberately used unidealised bodies — calloused hands, grime, ordinary faces — as a theological argument about who salvation is for."
        },
        {
          "label": "Dutch daylight",
          "detail": "In Vermeer and de Hooch, light comes from a real window at a measurable angle and falls across a real wall. The drama is in the accuracy."
        }
      ],
      "legacy": "Caravaggio's hard light and black shadow never really left — it runs through Rembrandt, into 19th-century realism, and straight on into film noir and modern cinematography."
    },
    "keyArtists": [
      {
        "name": "Caravaggio",
        "years": "1571 – 1610",
        "nationality": "Italian",
        "epithet": "Killer, fugitive, revolutionary",
        "bio": "He painted saints as labourers under raking light, brawled his way across Italy, and died at 38 with a price on his head.",
        "longBio": "Michelangelo Merisi da Caravaggio worked directly onto the canvas without preparatory drawings, using live models posed in a darkened studio with a single high light. The results were so immediate that clients sometimes refused them for irreverence. His life matched the work: repeated arrests, a killing in 1606 over what may have been a wager, flight to Naples, Malta and Sicily, a disfiguring attack, and death on a beach at Porto Ercole while chasing a pardon.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Bild-Ottavio_Leoni%2C_Caravaggio.jpg/960px-Bild-Ottavio_Leoni%2C_Caravaggio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Calling of St Matthew",
            "year": "1599–1600",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Caravaggio_-_La_vocazione_di_San_Matteo.jpg/960px-Caravaggio_-_La_vocazione_di_San_Matteo.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The light enters at the same angle as the chapel's real window, so the painted illumination and the actual daylight arrive together.",
            "sourceCredit": "San Luigi dei Francesi, Rome",
            "sourceLink": "https://saintlouis-rome.net/en/"
          },
          {
            "title": "Judith Beheading Holofernes",
            "year": "c. 1599",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Judith_Beheading_Holofernes-Caravaggio_%28c.1598-9%29.jpg/960px-Judith_Beheading_Holofernes-Caravaggio_%28c.1598-9%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Judith recoils as she cuts, arms straight, expression squeamish — an unheroic reluctance that no earlier painter had allowed her.",
            "sourceCredit": "Palazzo Barberini, Rome",
            "sourceLink": "https://www.barberinicorsini.org/en/"
          },
          {
            "title": "Supper at Emmaus",
            "year": "1601",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Supper_at_Emmaus-Caravaggio_%281601%29.jpg/960px-Supper_at_Emmaus-Caravaggio_%281601%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The fruit basket tips over the table edge into our space, and the fruit in it is visibly spotted and past its best.",
            "sourceCredit": "The National Gallery, London",
            "sourceLink": "https://www.nationalgallery.org.uk/paintings/michelangelo-merisi-da-caravaggio-the-supper-at-emmaus"
          },
          {
            "title": "The Incredulity of Saint Thomas",
            "year": "c. 1602",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/The_Incredulity_of_Saint_Thomas_by_Caravaggio.jpg/960px-The_Incredulity_of_Saint_Thomas_by_Caravaggio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Christ takes Thomas by the wrist and guides the finger physically into the wound. The doubt is resolved by touch, not argument.",
            "sourceCredit": "Sanssouci Picture Gallery, Potsdam",
            "sourceLink": "https://www.spsg.de/en/"
          }
        ]
      },
      {
        "name": "Rembrandt van Rijn",
        "years": "1606 – 1669",
        "nationality": "Dutch",
        "epithet": "The great self-examiner",
        "bio": "He painted himself for forty years, from confident youth to bankrupt old age, leaving the most sustained self-portrait record in art.",
        "longBio": "Rembrandt was successful early and ruined later — his spending, the collapse of the art market, and a series of family deaths left him insolvent in 1656, his collection auctioned off. The late work is his greatest: paint applied thickly enough to catch real light, faces built from apparently careless strokes. Roughly eighty self-portraits survive across paintings, etchings and drawings, and read as an unflinching record of a face aging.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/960px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Night Watch",
            "year": "1642",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg/960px-The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Trimmed on all four sides in 1715 to fit between two doors in Amsterdam's town hall. The cut strips were never kept.",
            "sourceCredit": "Rijksmuseum, Amsterdam",
            "sourceLink": "https://www.rijksmuseum.nl/en/collection/SK-C-5"
          },
          {
            "title": "The Anatomy Lesson of Dr Nicolaes Tulp",
            "year": "1632",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg/960px-Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The dissected arm is anatomically wrong — Rembrandt appears to have copied it from a textbook rather than the body in front of him.",
            "sourceCredit": "Mauritshuis, The Hague",
            "sourceLink": "https://www.mauritshuis.nl/en/"
          },
          {
            "title": "Self-Portrait",
            "year": "c. 1659",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/960px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Painted after bankruptcy had cost him his house and collection. He kept painting his own face for another decade.",
            "sourceCredit": "National Gallery of Art, Washington",
            "sourceLink": "https://www.nga.gov/"
          },
          {
            "title": "The Return of the Prodigal Son",
            "year": "c. 1669",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg/960px-Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The father's two hands differ — one broad and muscular, one slender. Whether deliberate or unfinished, it has been read as both parents in one gesture.",
            "sourceCredit": "Hermitage Museum, St Petersburg",
            "sourceLink": "https://www.hermitagemuseum.org/"
          }
        ]
      },
      {
        "name": "Artemisia Gentileschi",
        "years": "1593 – c. 1656",
        "nationality": "Italian",
        "epithet": "The first woman in the Accademia",
        "bio": "She was raped by her tutor at 17, testified under torture at his trial, and painted Judith beheading Holofernes with unmatched force.",
        "longBio": "Artemisia trained under her father Orazio, and after the 1612 trial of Agostino Tassi — during which she was tortured with thumbscrews to test her testimony — she left Rome, married, and built an independent career in Florence, Naples and London. She was the first woman admitted to the Accademia delle Arti del Disegno. Her Judith is the definitive treatment of the subject: two women applying real physical effort, sleeves pushed back, blood arcing.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Self-portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg/960px-Self-portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Judith Beheading Holofernes",
            "year": "c. 1620",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Artemisia_Gentileschi_-_Judith_Beheading_Holofernes_-_WGA8563.jpg/960px-Artemisia_Gentileschi_-_Judith_Beheading_Holofernes_-_WGA8563.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Unlike Caravaggio's squeamish Judith, hers braces her whole body into the work, and the maid holds the man down. It is a two-woman job, done properly.",
            "sourceCredit": "Galleria degli Uffizi, Florence",
            "sourceLink": "https://www.uffizi.it/en"
          },
          {
            "title": "Judith Beheading Holofernes (Naples)",
            "year": "c. 1612–1613",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Gentileschi_Artemisia_Judith_Beheading_Holofernes_Naples.jpg/960px-Gentileschi_Artemisia_Judith_Beheading_Holofernes_Naples.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The earlier version, painted around the time of the trial. The blood spatter follows arterial trajectories that a physicist later confirmed as broadly accurate.",
            "sourceCredit": "Museo di Capodimonte, Naples",
            "sourceLink": "https://capodimonte.cultura.gov.it/"
          },
          {
            "title": "Self-Portrait as the Allegory of Painting",
            "year": "c. 1638–1639",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Self-portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg/960px-Self-portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Male artists could only paint the allegory of Painting as a woman standing beside them. Being a woman, she could simply be it.",
            "sourceCredit": "Royal Collection, Windsor",
            "sourceLink": "https://www.rct.uk/collection"
          }
        ]
      },
      {
        "name": "Johannes Vermeer",
        "years": "1632 – 1675",
        "nationality": "Dutch",
        "epithet": "Thirty-four paintings, one window",
        "bio": "He worked slowly, left barely three dozen pictures, and was almost entirely forgotten for two hundred years.",
        "longBio": "Vermeer painted few pictures, mostly of one or two figures in a corner of a room lit from a window on the left. He died in debt at 43, leaving eleven children, and his name effectively vanished until a French critic reconstructed his catalogue in the 1860s. The optical precision of his work — dots of light on bread and pearls, out-of-focus foregrounds — has led many to argue he used a camera obscura, though no direct evidence survives.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Jan_Vermeer_van_Delft_002.jpg/960px-Jan_Vermeer_van_Delft_002.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Girl with a Pearl Earring",
            "year": "c. 1665",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Johannes_Vermeer_%281632-1675%29_-_The_Girl_With_The_Pearl_Earring_%281665%29.jpg/960px-Johannes_Vermeer_%281632-1675%29_-_The_Girl_With_The_Pearl_Earring_%281665%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "It is not a portrait but a tronie — a study of a type. And the earring is too large and too bright to be a real pearl; it is probably polished glass.",
            "sourceCredit": "Mauritshuis, The Hague",
            "sourceLink": "https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/"
          },
          {
            "title": "The Art of Painting",
            "year": "c. 1666",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Jan_Vermeer_van_Delft_007.jpg/960px-Jan_Vermeer_van_Delft_007.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Vermeer never sold it, and his widow tried to keep it from creditors after his death. Hitler later acquired it for his planned museum at Linz.",
            "sourceCredit": "Kunsthistorisches Museum, Vienna",
            "sourceLink": "https://www.khm.at/en/"
          },
          {
            "title": "The Milkmaid",
            "year": "c. 1658",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Vermeer_-_The_Milkmaid.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "factoid": "X-rays show he painted out a wall map and a laundry basket behind her, stripping the background back to bare plaster.",
            "sourceCredit": "Rijksmuseum, Amsterdam",
            "sourceLink": "https://www.rijksmuseum.nl/en/collection/SK-A-2344"
          }
        ]
      },
      {
        "name": "Diego Velázquez",
        "years": "1599 – 1660",
        "nationality": "Spanish",
        "epithet": "Court painter who painted the court painting him",
        "bio": "Las Meninas puts the artist, his canvas, the royal family and the viewer into a single unresolvable spatial puzzle.",
        "longBio": "Velázquez spent most of his career as a court official to Philip IV, which gave him security and comparatively few commissions. His handling grew freer over time — up close, the late work is a mess of loose strokes that only assembles at distance. Las Meninas has been argued over continuously for three centuries: who is being painted, where the king and queen are standing, and whether the mirror shows them or the canvas.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Diego_Vel%C3%A1zquez_Autorretrato_45_x_38_cm_-_Colecci%C3%B3n_Real_Academia_de_Bellas_Artes_de_San_Carlos_-_Museo_de_Bellas_Artes_de_Valencia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Las Meninas",
            "year": "1656",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/960px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The mirror at the back shows the king and queen — standing exactly where the viewer stands. You are occupying the royal position, and the painter is looking straight at you.",
            "sourceCredit": "Museo del Prado, Madrid",
            "sourceLink": "https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7800-9ade-48b0-ab8b-edee94ea877f"
          },
          {
            "title": "The Rokeby Venus",
            "year": "c. 1647–1651",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Diego_Vel%C3%A1zquez_016.jpg/960px-Diego_Vel%C3%A1zquez_016.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "A suffragette slashed it seven times with a meat cleaver in the National Gallery in 1914, in protest at the arrest of Emmeline Pankhurst.",
            "sourceCredit": "The National Gallery, London",
            "sourceLink": "https://www.nationalgallery.org.uk/paintings/diego-velazquez-the-toilet-of-venus-the-rokeby-venus"
          }
        ]
      },
      {
        "name": "Peter Paul Rubens",
        "years": "1577 – 1640",
        "nationality": "Flemish",
        "epithet": "Painter, diplomat, industrialist",
        "bio": "He ran the largest workshop in Europe, spoke six languages, and negotiated peace treaties between his commissions.",
        "longBio": "Rubens operated at a scale no other painter matched: a large Antwerp studio with assistants including Van Dyck, producing enormous altarpieces and cycles on an almost industrial basis, with a price structure that varied by how much of the canvas the master had touched. He was also a genuine diplomat, knighted by both Charles I of England and Philip IV of Spain for his negotiating work.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Peter_Paul_Rubens_-_Self-Portrait_-_WGA20380.jpg/960px-Peter_Paul_Rubens_-_Self-Portrait_-_WGA20380.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Three Graces",
            "year": "c. 1635",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Peter_Paul_Rubens_043.jpg/960px-Peter_Paul_Rubens_043.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Rubens kept this one for himself until he died. The Grace on the left is generally identified as his second wife, Helena Fourment.",
            "sourceCredit": "Museo del Prado, Madrid",
            "sourceLink": "https://www.museodelprado.es/en"
          }
        ]
      },
      {
        "name": "Nicolas Poussin",
        "years": "1594 – 1665",
        "nationality": "French",
        "epithet": "Reason against spectacle",
        "bio": "Working in Rome, he answered Baroque theatricality with cool, classical order built from small wax models on a stage.",
        "longBio": "Poussin spent nearly his whole career in Rome and painted mostly modest-sized canvases for private intellectual collectors rather than churches. He composed by building miniature stage sets — wax figures arranged in a box, lit and moved until the arrangement worked. The result is a deliberate counter-argument to Baroque drama: measured, legible, and full of classical learning. French academic painting took him as its foundation for the next two centuries.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Nicolas_Poussin_078.jpg/960px-Nicolas_Poussin_078.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Et in Arcadia Ego",
            "year": "c. 1638",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Nicolas_Poussin_-_Et_in_Arcadia_ego_%28deuxi%C3%A8me_version%29.jpg/960px-Nicolas_Poussin_-_Et_in_Arcadia_ego_%28deuxi%C3%A8me_version%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Shepherds in paradise trace an inscription on a tomb: \"Even in Arcadia, I am here.\" Death is speaking, and it is the only voice in the picture.",
            "sourceCredit": "Musée du Louvre, Paris",
            "sourceLink": "https://www.louvre.fr/en"
          }
        ]
      }
    ]
  },
  {
    "id": "impressionism",
    "name": "Impressionism",
    "shortName": "Impressionism",
    "yearRange": "1860 – 1900",
    "tagline": "Painting the moment it happens",
    "description": "Rejected by the Salon, a handful of painters left the studio for the riverbank. Portable paint tubes and broken brushwork let them chase light itself — and the Post-Impressionists then bent that freedom toward pure emotion.",
    "characteristics": [
      "Plein-air painting",
      "Broken colour & visible strokes",
      "Fleeting light",
      "Modern everyday life"
    ],
    "theme": {
      "accent": "#38bdf8",
      "gradientFrom": "#1e3a8a",
      "gradientTo": "#080c18",
      "glow": "rgba(56, 189, 248, 0.32)"
    },
    "heroArtwork": {
      "title": "The Starry Night",
      "artist": "Vincent van Gogh",
      "year": "1889",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/960px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "placeholderUrl": "/placeholder-hero-impressionism.jpg",
      "sourceCredit": "Museum of Modern Art, New York",
      "sourceLink": "https://www.moma.org/collection/works/79802",
      "factoid": "Van Gogh painted this from memory in an asylum room whose window faced east — and mathematicians have found that its swirls closely model turbulent flow, a phenomenon not formally described until decades later."
    },
    "deepDive": {
      "essay": [
        "Two boring technical facts made Impressionism possible. The first is the collapsible metal paint tube, patented in 1841, which meant paint could be carried and stored without drying out. The second is the railway, which put the countryside within a day of Paris. Together they let painters work outdoors, in front of the thing, finishing pictures on the spot rather than working up studio versions from sketches.",
        "What they saw when they got there was that colour is not a property of objects but of light bouncing off them. A haystack is not brown; it is orange at sunset and blue-violet in snow. Painted in broken, unblended strokes, those colours mix in the viewer's eye rather than on the palette, which is why the pictures shimmer up close into apparent chaos and resolve at distance.",
        "The establishment hated it. The Salon rejected them; a critic coined \"Impressionism\" from a Monet title as an insult; the 1874 independent exhibition was widely mocked. Within twenty years they had won completely — and the Post-Impressionists were already pulling the discovery in stranger directions: Cézanne toward structure, Seurat toward optical theory, Van Gogh and Gauguin toward feeling and symbol."
      ],
      "moments": [
        {
          "year": "1863",
          "title": "Salon des Refusés",
          "detail": "So many works are rejected by the official Salon that Napoleon III orders a separate exhibition of the refused. The monopoly cracks."
        },
        {
          "year": "1874",
          "title": "The first independent show",
          "detail": "Monet, Degas, Renoir, Pissarro and Morisot exhibit together. A critic mocks Monet's Impression, Sunrise, and accidentally names the movement.",
          "anchorWork": "Impression, Sunrise"
        },
        {
          "year": "1884",
          "title": "Seurat begins La Grande Jatte",
          "detail": "Pointillism applies colour theory systematically — Impressionist optics turned into a method.",
          "anchorWork": "A Sunday on La Grande Jatte"
        },
        {
          "year": "1886",
          "title": "The last group exhibition",
          "detail": "The eighth and final Impressionist show. The group is dissolving as its members diverge."
        },
        {
          "year": "1888",
          "title": "Arles",
          "detail": "Van Gogh and Gauguin share a house for nine weeks. It ends with a severed ear and the end of the friendship.",
          "anchorWork": "The Bedroom"
        },
        {
          "year": "1890",
          "title": "Van Gogh dies",
          "detail": "He dies at 37 having sold almost nothing. Within twenty years he is among the most celebrated painters in Europe.",
          "anchorWork": "Wheatfield with Crows"
        }
      ],
      "lookFor": [
        {
          "label": "Visible brushstrokes",
          "detail": "The mark is left showing on purpose. Academic painting hid the hand; this insists on it."
        },
        {
          "label": "Coloured shadows",
          "detail": "Shadows here are blue, violet or green — never grey or black. This was one of the most attacked features of the style."
        },
        {
          "label": "The cropped edge",
          "detail": "Figures sliced by the frame, borrowed from Japanese prints and photography, make the scene feel glimpsed rather than staged."
        },
        {
          "label": "Series",
          "detail": "Monet painted the same haystack, cathedral and pond dozens of times. The subject is not the object — it is the light on it at one moment."
        }
      ],
      "legacy": "Once colour was freed from description, everything downstream became possible. Fauvism, Expressionism and abstraction all start from the permission Impressionism won."
    },
    "keyArtists": [
      {
        "name": "Claude Monet",
        "years": "1840 – 1926",
        "nationality": "French",
        "epithet": "The same subject, over and over",
        "bio": "The movement took its name from one of his titles — originally an insult. He spent his last decades painting one pond.",
        "longBio": "Monet pursued a single idea further than anyone: that the subject of a painting is the light falling on it at a specific instant. He worked in series — haystacks, poplars, Rouen Cathedral, the Thames — sometimes with several canvases going at once, switching as the light moved. At Giverny he built the water-lily garden expressly as a subject and painted it for nearly thirty years, ending with vast, near-abstract panels made while his eyesight was failing.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_1899_Nadar_crop.jpg/960px-Claude_Monet_1899_Nadar_crop.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Impression, Sunrise",
            "year": "1872",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Claude_Monet%2C_Impression%2C_soleil_levant.jpg/960px-Claude_Monet%2C_Impression%2C_soleil_levant.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "A critic took the title and coined \"Impressionism\" as a sneer, writing that wallpaper was more finished. The painters adopted the insult as their name.",
            "sourceCredit": "Musée Marmottan Monet, Paris",
            "sourceLink": "https://www.marmottan.fr/en/"
          },
          {
            "title": "Water Lilies",
            "year": "c. 1906",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/960px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Monet's cataracts turned his vision muddy red and yellow. After surgery he could see ultraviolet, and repainted canvases he now found unbearably blue.",
            "sourceCredit": "Art Institute of Chicago",
            "sourceLink": "https://www.artic.edu/collection"
          },
          {
            "title": "Rouen Cathedral, West Façade",
            "year": "1894",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Claude_Monet_-_Rouen_Cathedral%2C_West_Fa%C3%A7ade_-_Google_Art_Project.jpg/960px-Claude_Monet_-_Rouen_Cathedral%2C_West_Fa%C3%A7ade_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "He painted the façade more than thirty times from a rented room opposite, working several canvases in rotation as the light shifted through the day.",
            "sourceCredit": "National Gallery of Art, Washington",
            "sourceLink": "https://www.nga.gov/"
          },
          {
            "title": "Woman with a Parasol",
            "year": "1875",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg/960px-Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "His wife Camille and their son, painted outdoors in a single session. Her veil and dress are lit from behind, so her face is entirely in reflected light.",
            "sourceCredit": "National Gallery of Art, Washington",
            "sourceLink": "https://www.nga.gov/"
          }
        ]
      },
      {
        "name": "Vincent van Gogh",
        "years": "1853 – 1890",
        "nationality": "Dutch",
        "epithet": "Ten years, almost no sales",
        "bio": "He painted for barely a decade, sold virtually nothing, and used colour as a direct carrier of feeling.",
        "longBio": "Van Gogh came to painting late, after failing as an art dealer, a teacher and a missionary. In roughly ten years he produced about 2,100 works, including some 860 oil paintings, most of them in his final two years. His letters to his brother Theo — who supported him financially throughout — are among the most detailed accounts any painter has left of their own intentions. He died at 37 from a gunshot wound, having sold almost nothing during his lifetime.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/960px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Starry Night",
            "year": "1889",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/960px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The village below is Dutch, not Provençal. He painted a church spire remembered from home into a French landscape that never had one.",
            "sourceCredit": "Museum of Modern Art, New York",
            "sourceLink": "https://www.moma.org/collection/works/79802"
          },
          {
            "title": "Sunflowers",
            "year": "1888",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/960px-Vincent_Willem_van_Gogh_127.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "He used chrome yellow, a new pigment already known to be unstable. The flowers are measurably browner now than when he painted them.",
            "sourceCredit": "The National Gallery, London",
            "sourceLink": "https://www.nationalgallery.org.uk/paintings/vincent-van-gogh-sunflowers"
          },
          {
            "title": "Self-Portrait",
            "year": "1889",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/960px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "He painted over thirty self-portraits in four years, largely because he could not afford to pay models.",
            "sourceCredit": "Musée d'Orsay, Paris",
            "sourceLink": "https://www.musee-orsay.fr/en"
          },
          {
            "title": "Wheatfield with Crows",
            "year": "1890",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg/960px-Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Long described as his last painting and read as a suicide note. It is neither — several canvases came after it.",
            "sourceCredit": "Van Gogh Museum, Amsterdam",
            "sourceLink": "https://www.vangoghmuseum.nl/en"
          },
          {
            "title": "Café Terrace at Night",
            "year": "1888",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg/960px-Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "One of the first times he painted a night scene on the spot rather than from memory — reportedly working by candlelight stuck to his hat brim.",
            "sourceCredit": "Kröller-Müller Museum, Otterlo",
            "sourceLink": "https://krollermuller.nl/en"
          },
          {
            "title": "The Bedroom",
            "year": "1888",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg/960px-Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The walls were originally violet, not blue. The red pigment he mixed in has faded, so we see a colour scheme he never actually painted.",
            "sourceCredit": "Van Gogh Museum, Amsterdam",
            "sourceLink": "https://www.vangoghmuseum.nl/en"
          }
        ]
      },
      {
        "name": "Edgar Degas",
        "years": "1834 – 1917",
        "nationality": "French",
        "epithet": "Realist who hated the label",
        "bio": "He rejected the word Impressionist, worked indoors from memory, and studied dancers off-guard rather than performing.",
        "longBio": "Degas exhibited with the Impressionists but shared few of their methods — he disliked painting outdoors, drew obsessively, and composed in the studio. His subject was the body at work: dancers stretching and adjusting straps, laundresses yawning, milliners. The radical cropping and high viewpoints come from Japanese prints and photography. As his sight failed he moved to pastel and then to wax sculpture, working by touch.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Edgar_Germain_Hilaire_Degas_017.jpg/960px-Edgar_Germain_Hilaire_Degas_017.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Ballet Class",
            "year": "c. 1874",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Edgar_Germain_Hilaire_Degas_017.jpg/960px-Edgar_Germain_Hilaire_Degas_017.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Degas was going blind as he painted dancers. In his last years he turned to sculpture, working wax by touch when he could no longer see well enough to paint.",
            "sourceCredit": "Musée d'Orsay, Paris",
            "sourceLink": "https://www.musee-orsay.fr/en"
          },
          {
            "title": "L'Absinthe",
            "year": "1876",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Edgar_Degas_-_In_a_Caf%C3%A9_-_Google_Art_Project_2.jpg/960px-Edgar_Degas_-_In_a_Caf%C3%A9_-_Google_Art_Project_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Shown in London, it was denounced as a lesson in degradation. Critics attacked the two models personally and it was withdrawn from view.",
            "sourceCredit": "Musée d'Orsay, Paris",
            "sourceLink": "https://www.musee-orsay.fr/en"
          },
          {
            "title": "L'Étoile (The Star)",
            "year": "c. 1878",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Edgar_Degas_-_Ballet_%28L%27%C3%89toile%29.jpg/960px-Edgar_Degas_-_Ballet_%28L%27%C3%89toile%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "We look down from a box, and a man in evening dress waits in the wings — a subscriber with backstage access. The picture is about that arrangement as much as the dance.",
            "sourceCredit": "Musée d'Orsay, Paris",
            "sourceLink": "https://www.musee-orsay.fr/en"
          }
        ]
      },
      {
        "name": "Pierre-Auguste Renoir",
        "years": "1841 – 1919",
        "nationality": "French",
        "epithet": "Pleasure without apology",
        "bio": "He painted dances, lunches and dappled sunlight, and kept working with brushes strapped to his hands when arthritis took his grip.",
        "longBio": "Renoir began as a porcelain painter, which shows in his handling of skin and light. His great Parisian pictures of the late 1870s — the Moulin de la Galette, the Boating Party — are large multi-figure scenes painted substantially outdoors, an enormous technical undertaking. Severe rheumatoid arthritis crippled his hands in later life; he continued painting with brushes wedged into bandaged fingers, and took up sculpture with an assistant's hands.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Renoir%2C_Pierre-Auguste%2C_by_Dornac%2C_BNF_Gallica.jpg/960px-Renoir%2C_Pierre-Auguste%2C_by_Dornac%2C_BNF_Gallica.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Bal du moulin de la Galette",
            "year": "1876",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Pierre-Auguste_Renoir%2C_Le_Moulin_de_la_Galette.jpg/960px-Pierre-Auguste_Renoir%2C_Le_Moulin_de_la_Galette.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "A large canvas painted substantially on site at a Montmartre dance garden — friends posed as the dancers over successive Sunday afternoons.",
            "sourceCredit": "Musée d'Orsay, Paris",
            "sourceLink": "https://www.musee-orsay.fr/en"
          },
          {
            "title": "Luncheon of the Boating Party",
            "year": "1881",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Pierre-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg/960px-Pierre-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The woman playing with the dog is Aline Charigot, who later became his wife. Most of the other figures are also identifiable friends.",
            "sourceCredit": "The Phillips Collection, Washington",
            "sourceLink": "https://www.phillipscollection.org/"
          }
        ]
      },
      {
        "name": "Paul Cézanne",
        "years": "1839 – 1906",
        "nationality": "French",
        "epithet": "The bridge to Cubism",
        "bio": "He wanted to make Impressionism \"solid and durable\", and in doing so took painting apart into planes.",
        "longBio": "Cézanne worked slowly and obsessively, sometimes over a hundred sessions on one still life, treating the canvas as a problem in construction rather than description. He shifted viewpoints within a single picture — a tabletop seen from slightly above while the bottle is seen straight on — so the image holds together as a designed surface rather than a window. Both Picasso and Matisse called him the father of modern painting, and Cubism starts directly from what he was doing with planes.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Paul_C%C3%A9zanne_-_Self-Portrait_-_Google_Art_Project.jpg/960px-Paul_C%C3%A9zanne_-_Self-Portrait_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Mont Sainte-Victoire",
            "year": "c. 1890s",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg/960px-Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "He painted this mountain more than eighty times. It stood behind the house where he grew up, and he kept returning until the year he died.",
            "sourceCredit": "Various collections — versions in the Met, Philadelphia and the Courtauld",
            "sourceLink": "https://www.metmuseum.org/art/collection"
          },
          {
            "title": "The Card Players",
            "year": "1892–1895",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Les_Joueurs_de_cartes%2C_par_Paul_C%C3%A9zanne.jpg/960px-Les_Joueurs_de_cartes%2C_par_Paul_C%C3%A9zanne.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "One of five versions. In 2011 another sold to the royal family of Qatar for a sum reported at over $250 million.",
            "sourceCredit": "Musée d'Orsay, Paris",
            "sourceLink": "https://www.musee-orsay.fr/en"
          }
        ]
      },
      {
        "name": "Paul Gauguin",
        "years": "1848 – 1903",
        "nationality": "French",
        "epithet": "Flat colour and invented symbol",
        "bio": "He abandoned a stockbroking career and eventually France itself, painting Tahiti in flat, arbitrary colour.",
        "longBio": "Gauguin gave up a comfortable career and his family to paint, worked in Brittany, shared a disastrous nine weeks with Van Gogh in Arles, and then left for Tahiti in 1891. His mature style abandons modelling and perspective for flat areas of non-naturalistic colour bounded by strong contour — a decisive break from Impressionist optics toward symbol. His conduct in Polynesia, including relationships with girls in their early teens, is now inseparable from assessments of the work.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Paul_Gauguin_111.jpg/960px-Paul_Gauguin_111.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Where Do We Come From? What Are We? Where Are We Going?",
            "year": "1897–1898",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Paul_Gauguin_-_D%27ou_venons-nous.jpg/960px-Paul_Gauguin_-_D%27ou_venons-nous.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "He painted it intending to kill himself immediately afterwards, and wrote the three questions directly onto the canvas. The attempt failed and he lived five more years.",
            "sourceCredit": "Museum of Fine Arts, Boston",
            "sourceLink": "https://collections.mfa.org/"
          },
          {
            "title": "Vision After the Sermon",
            "year": "1888",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Paul_Gauguin_056.jpg/960px-Paul_Gauguin_056.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The ground is flat vermilion — not a field but a decision. It is one of the first pictures to make colour purely symbolic rather than descriptive.",
            "sourceCredit": "Scottish National Gallery, Edinburgh",
            "sourceLink": "https://www.nationalgalleries.org/"
          }
        ]
      },
      {
        "name": "Georges Seurat",
        "years": "1859 – 1891",
        "nationality": "French",
        "epithet": "Optics as method",
        "bio": "He built pictures from millions of separate dots according to colour theory, and died at 31.",
        "longBio": "Seurat read the colour science of Chevreul and Rood and set out to put Impressionist intuition on a systematic footing. Pointillism places small touches of unmixed pigment side by side so that the mixing happens optically in the viewer's eye, producing — in theory — greater luminosity than mixing on the palette. La Grande Jatte took him two years. He died suddenly at 31, probably of an infectious illness, with the movement he founded barely started.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Georges_Seurat_1888.jpg/960px-Georges_Seurat_1888.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "A Sunday on La Grande Jatte",
            "year": "1884–1886",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.jpg/960px-Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "He later added a painted border of dots directly onto the canvas, because he decided a conventional frame interfered with the optical mixing.",
            "sourceCredit": "Art Institute of Chicago",
            "sourceLink": "https://www.artic.edu/artworks/27992/"
          }
        ]
      },
      {
        "name": "Henri de Toulouse-Lautrec",
        "years": "1864 – 1901",
        "nationality": "French",
        "epithet": "Montmartre from the inside",
        "bio": "He lived among the dancers and prostitutes he drew, and turned the advertising poster into an art form.",
        "longBio": "Two childhood fractures and an underlying bone condition left Toulouse-Lautrec with an adult torso on undeveloped legs, standing about five feet. Born into aristocracy, he settled in Montmartre and drew its cabarets, brothels and performers with sharp, unsentimental line. His lithographic posters for the Moulin Rouge were printed in the hundreds and pasted on walls — commercial work that is now central to his reputation. He died at 36 from the combined effects of alcoholism and syphilis.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/%28Albi%29_Mus%C3%A9e_Toulouse-Lautrec_-_Portrait_de_Toulouse_Lautrec%2C_t%C3%AAte_nue%2C_de_face_%281883%29_-_Javal.jpg/960px-%28Albi%29_Mus%C3%A9e_Toulouse-Lautrec_-_Portrait_de_Toulouse_Lautrec%2C_t%C3%AAte_nue%2C_de_face_%281883%29_-_Javal.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "At the Moulin Rouge",
            "year": "1892–1895",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Henri_de_Toulouse-Lautrec_-_At_the_Moulin_Rouge_-_Google_Art_Project.jpg/960px-Henri_de_Toulouse-Lautrec_-_At_the_Moulin_Rouge_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The green-lit face at the right edge was cut off the canvas by a dealer who thought it too disturbing, and only reattached decades later.",
            "sourceCredit": "Art Institute of Chicago",
            "sourceLink": "https://www.artic.edu/collection"
          }
        ]
      },
      {
        "name": "Camille Pissarro",
        "years": "1830 – 1903",
        "nationality": "Danish-French",
        "epithet": "The one who held the group together",
        "bio": "The only painter to exhibit in all eight Impressionist shows, and a teacher to Cézanne and Gauguin.",
        "longBio": "Pissarro was the elder statesman of the group and its most consistent participant — the only member in every one of the eight exhibitions. He was generous as a teacher and mentor: Cézanne and Gauguin both worked alongside him, and Cézanne later described himself as his pupil. In his sixties an eye condition stopped him working outdoors, so he took rooms overlooking Paris boulevards and painted the street below in series.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Camille_Pissarro_003.jpg/960px-Camille_Pissarro_003.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Boulevard Montmartre, Spring",
            "year": "1897",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Camille_Pissarro_-_Boulevard_Montmartre%2C_Spring_-_Google_Art_Project.jpg/960px-Camille_Pissarro_-_Boulevard_Montmartre%2C_Spring_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "An eye infection stopped him painting outdoors, so he rented a hotel room above the boulevard and painted the same view in every season and light.",
            "sourceCredit": "Various collections — series split between museums worldwide",
            "sourceLink": "https://www.metmuseum.org/art/collection"
          }
        ]
      },
      {
        "name": "Berthe Morisot",
        "years": "1841 – 1895",
        "nationality": "French",
        "epithet": "Founding member, routinely overlooked",
        "bio": "She exhibited in nearly every Impressionist show and painted the domestic interior as a serious subject.",
        "longBio": "Morisot was a core member of the group from the first 1874 exhibition, and her handling — rapid, open, with bare canvas left showing — is among the most radical of any of them. Social convention barred a respectable woman from the cafés and streets her male colleagues painted, so she worked with what she could access: gardens, nurseries, women and children indoors. She married Manet's brother, and Manet painted her repeatedly.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Berthe_Morisot.jpg/960px-Berthe_Morisot.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Cradle",
            "year": "1872",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Berthe_Morisot_-_The_Cradle_-_Google_Art_Project.jpg/960px-Berthe_Morisot_-_The_Cradle_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Shown at the first Impressionist exhibition in 1874. The mother's gaze and the veil between her and the baby make it far cooler and more ambiguous than the subject suggests.",
            "sourceCredit": "Musée d'Orsay, Paris",
            "sourceLink": "https://www.musee-orsay.fr/en"
          }
        ]
      },
      {
        "name": "Mary Cassatt",
        "years": "1844 – 1926",
        "nationality": "American",
        "epithet": "American in Paris",
        "bio": "She joined the Impressionists at Degas's invitation and shaped which of their works ended up in American museums.",
        "longBio": "Cassatt trained in Philadelphia, settled in Paris, and was invited by Degas to exhibit with the Impressionists in 1879. Her subject was overwhelmingly women and children, handled with a structural rigour that keeps the sentiment in check. She was also enormously influential as an adviser to wealthy American collectors — a great deal of the Impressionist work now in US museums is there because Cassatt told someone to buy it. Japanese prints shown in Paris in 1890 transformed her handling of line and flat pattern.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mary_Cassatt_photograph_1913.jpg/960px-Mary_Cassatt_photograph_1913.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Child's Bath",
            "year": "1893",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Mary_Cassatt_-_The_Child%27s_Bath_-_Google_Art_Project.jpg/960px-Mary_Cassatt_-_The_Child%27s_Bath_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The steep overhead viewpoint and flattened pattern come straight from the Japanese prints she saw in Paris in 1890.",
            "sourceCredit": "Art Institute of Chicago",
            "sourceLink": "https://www.artic.edu/collection"
          }
        ]
      }
    ]
  },
  {
    "id": "modern",
    "name": "Modern Art",
    "shortName": "Modern",
    "yearRange": "1900 – 1950",
    "tagline": "The picture stops being a window",
    "description": "Photography had taken over the job of recording appearances, so painting went looking for what only painting could do. Within fifty years it had abandoned perspective, then recognisable subject matter, then in some cases the image altogether.",
    "characteristics": [
      "Abstraction",
      "Psychological subject matter",
      "Flattened space",
      "Pure colour"
    ],
    "theme": {
      "accent": "#a78bfa",
      "gradientFrom": "#4338ca",
      "gradientTo": "#08060f",
      "glow": "rgba(167, 139, 250, 0.3)"
    },
    "heroArtwork": {
      "title": "The Scream",
      "artist": "Edvard Munch",
      "year": "1893",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/960px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "placeholderUrl": "/placeholder-hero-modern.jpg",
      "sourceCredit": "National Gallery, Oslo",
      "sourceLink": "https://www.nasjonalmuseet.no/en/",
      "factoid": "The figure is not screaming. Munch's diary records him standing on a bridge as the sky turned blood red and hearing \"a scream passing through nature\" — the figure is covering its ears against a sound coming from outside."
    },
    "deepDive": {
      "essay": [
        "By 1900 photography could record a likeness better, faster and cheaper than any painter. That removed painting's oldest job and raised an obvious question: what is a picture for, if not to show what something looks like?",
        "The answers came fast and in every direction. Munch and the Expressionists used distortion to render psychological states directly. Matisse and the Fauves let colour off the leash entirely — a face could be green if green was what the picture needed. Cézanne's planes became Cubism, which showed several viewpoints at once and finally broke the single fixed eye that perspective had installed five hundred years earlier.",
        "Then some artists removed the subject altogether. Kandinsky argued that colour and form could work like music, meaning something without depicting anything. Malevich exhibited a black square and hung it high in the corner of the room — the position reserved in a Russian home for the icon. Mondrian reduced painting to horizontals, verticals and three primaries. Within a single generation, art went from arguing about how to depict the world to arguing about whether it needed to."
      ],
      "moments": [
        {
          "year": "1893",
          "title": "The Scream",
          "detail": "Munch turns a private panic attack into an image that becomes shorthand for modern anxiety.",
          "anchorWork": "The Scream"
        },
        {
          "year": "1905",
          "title": "The Fauves",
          "detail": "Matisse and others exhibit paintings of such violent colour that a critic calls them wild beasts. The name sticks."
        },
        {
          "year": "1907",
          "title": "Cubism begins",
          "detail": "Picasso and Braque start fracturing objects into simultaneous viewpoints, dismantling single-point perspective."
        },
        {
          "year": "1911",
          "title": "Kandinsky goes abstract",
          "detail": "He begins making paintings with no depicted subject at all, arguing that form and colour affect the soul directly.",
          "anchorWork": "Composition VII"
        },
        {
          "year": "1915",
          "title": "Black Square",
          "detail": "Malevich exhibits a black square on white and hangs it in the icon corner. Painting reaches zero and starts again.",
          "anchorWork": "Black Square"
        },
        {
          "year": "1942",
          "title": "Nighthawks",
          "detail": "Hopper paints an all-night diner weeks after Pearl Harbor — American loneliness as a permanent condition.",
          "anchorWork": "Nighthawks"
        }
      ],
      "lookFor": [
        {
          "label": "Colour off the leash",
          "detail": "When a face is green or a shadow is red, the colour is doing emotional or structural work rather than describing anything."
        },
        {
          "label": "Flatness",
          "detail": "Modern painting keeps insisting the canvas is a flat surface. Watch for space that refuses to recede."
        },
        {
          "label": "Multiple viewpoints",
          "detail": "Cubism shows the front and side of a thing simultaneously — the sign that the fixed single eye has been abandoned."
        },
        {
          "label": "Missing icons",
          "detail": "Several defining works of this era are still in copyright and cannot be reproduced here. Their absence below is legal, not editorial."
        }
      ],
      "legacy": "Everything after 1950 — Abstract Expressionism, Pop, Minimalism, conceptual art — is downstream of the moment painting decided it did not owe the visible world a likeness."
    },
    "keyArtists": [
      {
        "name": "Edvard Munch",
        "years": "1863 – 1944",
        "nationality": "Norwegian",
        "epithet": "Anxiety made visible",
        "bio": "He painted illness, jealousy and dread directly, and made versions of his key images over and over across decades.",
        "longBio": "Munch lost his mother and his elder sister to tuberculosis in childhood, and his work returns compulsively to sickness, death and sexual anxiety. He worked in series and in multiples — there are four versions of The Scream, in paint and pastel, plus a lithograph he made so the image could be reproduced widely. The Nazis declared his work degenerate and removed it from German museums; he died in occupied Norway in 1944 and left his entire remaining output to the city of Oslo.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Edvard_Munch_1933-2.jpg/960px-Edvard_Munch_1933-2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Scream",
            "year": "1893",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/960px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "A pencil inscription on one version reads \"Can only have been painted by a madman\". Analysis in 2021 confirmed the handwriting is Munch's own.",
            "sourceCredit": "National Gallery, Oslo",
            "sourceLink": "https://www.nasjonalmuseet.no/en/"
          },
          {
            "title": "Madonna",
            "year": "1894–1895",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Edvard_Munch_-_Madonna_-_Google_Art_Project.jpg/960px-Edvard_Munch_-_Madonna_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The lithograph version frames her with swimming sperm and a foetus in the corner — the same image reworked into something far stranger.",
            "sourceCredit": "Munch Museum, Oslo",
            "sourceLink": "https://www.munchmuseet.no/en/"
          }
        ]
      },
      {
        "name": "Gustav Klimt",
        "years": "1862 – 1918",
        "nationality": "Austrian",
        "epithet": "Gold leaf and Vienna",
        "bio": "He covered his canvases in real gold and built a career on ornament, eroticism and portraits of Viennese society women.",
        "longBio": "Klimt trained as an architectural decorator, which is where the gold comes from — his father was a gold engraver. He led the Vienna Secession, breaking from the conservative art establishment, and his ceiling paintings for the university were rejected as pornographic and later destroyed by retreating SS troops in 1945. The \"golden phase\" pictures fuse Byzantine flatness with intensely detailed pattern, leaving only faces and hands modelled naturalistically.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/0/02/Gustav_Klimt_portrait_by_Moritz_N%C3%A4hr.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "The Kiss",
            "year": "1907–1908",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gustav_Klimt_016.jpg/960px-Gustav_Klimt_016.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The gold is genuine gold leaf, applied over the paint. Klimt learned the technique from his father, who engraved gold professionally.",
            "sourceCredit": "Belvedere, Vienna",
            "sourceLink": "https://www.belvedere.at/en"
          },
          {
            "title": "Portrait of Adele Bloch-Bauer I",
            "year": "1907",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Gustav_Klimt%2C_1907%2C_Adele_Bloch-Bauer_I%2C_Neue_Galerie_New_York.jpg/960px-Gustav_Klimt%2C_1907%2C_Adele_Bloch-Bauer_I%2C_Neue_Galerie_New_York.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Looted by the Nazis and displayed in Vienna for decades. Adele's niece won it back in 2006 after a US Supreme Court case, and it sold for $135 million.",
            "sourceCredit": "Neue Galerie, New York",
            "sourceLink": "https://www.neuegalerie.org/"
          }
        ]
      },
      {
        "name": "Wassily Kandinsky",
        "years": "1866 – 1944",
        "nationality": "Russian",
        "epithet": "Painting without a subject",
        "bio": "He gave up a law career at 30 and became one of the first painters to abandon depiction entirely.",
        "longBio": "Kandinsky was lecturing in law when he saw a Monet haystack and could not identify the subject — an experience he described as the moment he realised an image could work without one. He wrote Concerning the Spiritual in Art, arguing that colour and form act on the viewer the way music does, and taught at the Bauhaus until the Nazis closed it. He reportedly had synaesthesia, seeing colours when he heard sound, which shaped how he talked about painting.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/5/51/Vassily_Kandinsky%2C_1903_-_Gabriele_Munter_painting.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Composition VII",
            "year": "1913",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Composition_VII_-_Wassily_Kandinsky%2C_GAC.jpg/960px-Composition_VII_-_Wassily_Kandinsky%2C_GAC.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "He made over thirty preparatory studies, then painted the final canvas in four days.",
            "sourceCredit": "Tretyakov Gallery, Moscow",
            "sourceLink": "https://www.tretyakovgallery.ru/en/"
          }
        ]
      },
      {
        "name": "Kazimir Malevich",
        "years": "1879 – 1935",
        "nationality": "Russian",
        "epithet": "Painting reduced to zero",
        "bio": "He exhibited a black square in the corner reserved for religious icons and called it the zero point of painting.",
        "longBio": "Malevich founded Suprematism, an art of pure geometric form detached from any reference to objects. At the 1915 exhibition he hung Black Square high across a corner of the room — the placement used for the icon in a traditional Russian home, an unmistakable claim. Under Stalin, abstraction became dangerous; he was arrested and interrogated, and returned to figurative painting in his final years. He was buried in a Suprematist coffin, with a black square on his grave.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Self_Portrait_%28Kazimir_Malevich%2C_1913%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Black Square",
            "year": "1915",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Kazimir_Malevich%2C_1915%2C_Black_Suprematic_Square%2C_oil_on_linen_canvas%2C_79.5_x_79.5_cm%2C_Tretyakov_Gallery%2C_Moscow.jpg/960px-Kazimir_Malevich%2C_1915%2C_Black_Suprematic_Square%2C_oil_on_linen_canvas%2C_79.5_x_79.5_cm%2C_Tretyakov_Gallery%2C_Moscow.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "X-rays revealed two earlier compositions underneath, and a faint pencil inscription. The square is painted directly over abandoned work.",
            "sourceCredit": "Tretyakov Gallery, Moscow",
            "sourceLink": "https://www.tretyakovgallery.ru/en/"
          }
        ]
      },
      {
        "name": "Henri Matisse",
        "years": "1869 – 1954",
        "nationality": "French",
        "epithet": "Colour as structure",
        "bio": "Leader of the Fauves, who used colour with a freedom that got them called wild beasts.",
        "longBio": "Matisse came to painting at 20 while recovering from appendicitis, when his mother gave him a box of colours. He spent a career pursuing a kind of pictorial pleasure he described as an armchair for the tired businessman — a formulation that undersells how radical the work was. Late in life, unable to stand at an easel after surgery for abdominal cancer, he invented the cut-out: painted paper cut with scissors and pinned into compositions, which he called drawing with colour.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Henri_Matisse%2C_1913%2C_photograph_by_Alvin_Langdon_Coburn.jpg/960px-Henri_Matisse%2C_1913%2C_photograph_by_Alvin_Langdon_Coburn.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "La Danse (II)",
            "year": "1910",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/La_Danse_II%2C_par_Henri_Matisse.jpg/960px-La_Danse_II%2C_par_Henri_Matisse.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Commissioned by a Moscow textile merchant for his staircase. Only three colours appear in the whole canvas: blue, green and red.",
            "sourceCredit": "Hermitage Museum, St Petersburg",
            "sourceLink": "https://www.hermitagemuseum.org/"
          }
        ]
      },
      {
        "name": "Piet Mondrian",
        "years": "1872 – 1944",
        "nationality": "Dutch",
        "epithet": "Only straight lines and primaries",
        "bio": "He reduced painting to black grids, white grounds and red, yellow and blue — then spent decades refining the balance.",
        "longBio": "Mondrian began as a conventional landscape painter and moved by stages toward total abstraction, arriving at a vocabulary of horizontals, verticals, and the three primaries plus black, white and grey. He was rigorous to the point of dogma: he reportedly broke with a fellow De Stijl artist over the introduction of the diagonal. He fled to New York in 1940, where jazz and the city grid loosened his late work into something almost buoyant.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/8/83/Piet_Mondriaan.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
        "works": [
          {
            "title": "Composition II in Red, Blue and Yellow",
            "year": "1930",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/960px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The black lines are not borders around the colours — he painted them as bands in their own right, and their varying widths carry the whole balance.",
            "sourceCredit": "Kunsthaus Zürich",
            "sourceLink": "https://www.kunsthaus.ch/en/"
          }
        ]
      },
      {
        "name": "Edward Hopper",
        "years": "1882 – 1967",
        "nationality": "American",
        "epithet": "Light on an empty room",
        "bio": "He painted diners, motels and offices in which people sit together without connecting.",
        "longBio": "Hopper trained as an illustrator and worked commercially for years before painting full-time. His subject is American solitude, staged with theatrical light — the pictures often look like a scene glimpsed through a window from a passing train. His wife Josephine modelled for nearly every female figure in his mature work and kept the ledgers recording each painting. He is a foundational influence on American film, particularly noir.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Edward_Hopper%2C_New_York_artist_LCCN2016871478_%28cropped%29.jpg/960px-Edward_Hopper%2C_New_York_artist_LCCN2016871478_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Nighthawks",
            "year": "1942",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/960px-Nighthawks_by_Edward_Hopper_1942.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "There is no door. The glass runs unbroken around the corner, so there is no way into or out of the diner.",
            "sourceCredit": "Art Institute of Chicago",
            "sourceLink": "https://www.artic.edu/artworks/111628/nighthawks"
          },
          {
            "title": "Automat",
            "year": "1927",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Automat-edward-hopper-1927.jpg/960px-Automat-edward-hopper-1927.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The window behind her reflects nothing but two receding rows of ceiling lights — no street, no city. Outside is pure black.",
            "sourceCredit": "Des Moines Art Center, Iowa",
            "sourceLink": "https://www.desmoinesartcenter.org/"
          }
        ]
      },
      {
        "name": "Grant Wood",
        "years": "1891 – 1942",
        "nationality": "American",
        "epithet": "Regionalism's most parodied image",
        "bio": "American Gothic made him famous immediately and has been recycled in advertising ever since.",
        "longBio": "Wood was a leading figure in Regionalism, which argued for rural American subject matter against European modernism. American Gothic was painted after he spotted a small white house with an oversized Gothic window in Eldon, Iowa, and imagined the sort of people who might live in it. The models were his sister Nan and his dentist. Iowans were offended, reading it as mockery; Wood always insisted it was not.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Portrait_of_Nan%2C_by_Grant_Wood.jpg/960px-Portrait_of_Nan%2C_by_Grant_Wood.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "American Gothic",
            "year": "1930",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/960px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "They are not a married couple — the models were Wood's sister and his dentist, and he intended them as father and daughter.",
            "sourceCredit": "Art Institute of Chicago",
            "sourceLink": "https://www.artic.edu/artworks/6565/american-gothic"
          }
        ]
      },
      {
        "name": "Katsushika Hokusai",
        "years": "1760 – 1849",
        "nationality": "Japanese",
        "epithet": "The print that reshaped Europe",
        "bio": "His woodblock prints reached Paris as packing material and transformed European painting.",
        "longBio": "Hokusai worked for seventy years under more than thirty names and claimed that nothing he made before the age of seventy was of any value. The Thirty-Six Views of Mount Fuji, made in his early seventies, are colour woodblock prints produced in large editions for ordinary buyers. When Japanese goods reached Europe after 1853, these prints — flat colour, cropped compositions, high viewpoints — hit Degas, Van Gogh, Monet and Cassatt with enormous force. Japonisme runs right through Impressionism.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Hokusai_as_an_old_man.jpg/960px-Hokusai_as_an_old_man.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "The Great Wave off Kanagawa",
            "year": "c. 1831",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/960px-The_Great_Wave_off_Kanagawa.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The blue is imported Prussian blue, newly available in Japan. Thousands of impressions were printed, and it cost about the price of a bowl of noodles.",
            "sourceCredit": "Impressions in the Met, the British Museum and elsewhere",
            "sourceLink": "https://www.metmuseum.org/art/collection/search/36491"
          },
          {
            "title": "Fine Wind, Clear Morning (Red Fuji)",
            "year": "c. 1831",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Red_Fuji_southern_wind_clear_morning.jpg/960px-Red_Fuji_southern_wind_clear_morning.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The mountain only turns this colour for a few days in late summer at dawn, when clear air and low sun catch the slope.",
            "sourceCredit": "Impressions in the Met and the British Museum",
            "sourceLink": "https://www.metmuseum.org/art/collection"
          }
        ]
      }
    ],
    "offsiteWorks": [
      {
        "title": "Guernica",
        "artist": "Pablo Picasso",
        "year": "1937",
        "note": "Painted in a month after the bombing of a Basque town, in black, white and grey at nearly eight metres wide. Picasso refused to let it go to Spain while Franco lived; it arrived in 1981.",
        "holder": "Museo Reina Sofía, Madrid",
        "link": "https://www.museoreinasofia.es/en/collection/artwork/guernica"
      },
      {
        "title": "The Persistence of Memory",
        "artist": "Salvador Dalí",
        "year": "1931",
        "note": "The melting watches are famously said to have come from Dalí watching camembert soften in the sun. The canvas is smaller than a sheet of A3.",
        "holder": "Museum of Modern Art, New York",
        "link": "https://www.moma.org/collection/works/79018"
      },
      {
        "title": "Les Demoiselles d'Avignon",
        "artist": "Pablo Picasso",
        "year": "1907",
        "note": "The picture that opens Cubism. Picasso kept it in his studio for years, showing it only to other artists, several of whom found it appalling.",
        "holder": "Museum of Modern Art, New York",
        "link": "https://www.moma.org/collection/works/79766"
      },
      {
        "title": "The Two Fridas",
        "artist": "Frida Kahlo",
        "year": "1939",
        "note": "A double self-portrait painted around her divorce from Diego Rivera: two Fridas share a severed artery, one in European dress, one in Tehuana.",
        "holder": "Museo de Arte Moderno, Mexico City",
        "link": "https://mam.inba.gob.mx/"
      }
    ]
  },
  {
    "id": "contemporary",
    "name": "Contemporary Art",
    "shortName": "Contemporary",
    "yearRange": "1950 – now",
    "tagline": "Art walks off the wall",
    "description": "Modern art had emptied the picture until there was almost nothing left to remove. What followed was not a new style but an escape from the frame altogether — into rooms you walk through, steel that reshapes a landscape, a wall in the street. The question stopped being what a painting should look like and became whether the thing needed to be a painting at all.",
    "characteristics": [
      "Installation",
      "Monumental scale",
      "Site-specific",
      "Audience as participant"
    ],
    "theme": {
      "accent": "#f472b6",
      "gradientFrom": "#831843",
      "gradientTo": "#0a0510",
      "glow": "rgba(244, 114, 182, 0.3)"
    },
    "heroArtwork": {
      "title": "Sunflower Seeds",
      "artist": "Ai Weiwei",
      "year": "2010",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Ai_Weiwei%27s_Sunflower_Seeds%2C_Tate_Modern_1.jpg/1920px-Ai_Weiwei%27s_Sunflower_Seeds%2C_Tate_Modern_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "placeholderUrl": "/placeholder-hero-contemporary.jpg",
      "sourceCredit": "Tate Modern, London — photograph by Mike Peel, CC BY-SA 4.0",
      "sourceLink": "https://www.tate.org.uk/art/artworks/ai-sunflower-seeds-t13408",
      "factoid": "One hundred million porcelain seeds, each one individually hand-painted by around 1,600 artisans in Jingdezhen, the town that made imperial porcelain for centuries. Visitors were meant to walk across them; the floor closed after six days when the ceramic dust proved hazardous."
    },
    "deepDive": {
      "essay": [
        "Modern painting had spent fifty years removing things — perspective, then subject matter, then in Malevich's case the image itself. By 1950 the reduction had nowhere left to go. What came next was not another way of painting but a series of arguments about whether painting was still the point.",
        "The first answers were still made of paint. Pollock put the canvas on the floor and poured, so the finished work recorded the movement of a body rather than a view of anything. Rothko stacked blocks of colour and asked to have them hung low and lit dimly, close enough to fill your vision. Then Warhol screen-printed soup tins, and the distance between an artwork and a product collapsed on purpose.",
        "After that the work left the wall in earnest. Serra cut concrete into a field so the sculpture became the walk between its parts. Gormley stood a twenty-metre steel figure beside a motorway and planted a hundred more in a tidal beach to be swallowed twice a day. Kusama handed visitors sheets of coloured dots and let them obliterate a white room themselves. Ai Weiwei filled the Turbine Hall with a hundred million hand-painted seeds. The audience stopped being someone who looked at the work and became someone standing inside it."
      ],
      "moments": [
        {
          "year": "1950",
          "title": "Pollock drips",
          "detail": "Pollock lays canvas on the floor and pours paint from above — no easel, no brush touching cloth. The painting becomes a record of movement rather than an image of anything."
        },
        {
          "year": "1953",
          "title": "Rothko's rectangles",
          "detail": "Rothko settles on stacked blocks of soft-edged colour and instructs that they hang low, in dim light, close enough to fill the viewer's field of vision entirely."
        },
        {
          "year": "1962",
          "title": "Warhol paints soup",
          "detail": "Thirty-two canvases, one for every flavour Campbell's sold, made with screen-printing. Fine art adopts the visual logic of the supermarket shelf."
        },
        {
          "year": "1970",
          "title": "Serra cuts the land",
          "detail": "Six concrete sections set across an Ontario field. The sculpture is not the concrete but the walk between the parts, and the way the ground reveals itself as you move.",
          "anchorWork": "Shift"
        },
        {
          "year": "1998",
          "title": "The Angel lands",
          "detail": "Twenty metres of weathering steel goes up beside the A1 at Gateshead. Local opposition is fierce; within a decade it is the emblem of the North East.",
          "anchorWork": "Angel of the North"
        },
        {
          "year": "2008",
          "title": "Banksy on Newman Street",
          "detail": "Painted over three nights on scaffolding beside a CCTV camera, in full view of it. Removed the following year — impermanence built into the work.",
          "anchorWork": "One Nation Under CCTV"
        },
        {
          "year": "2010",
          "title": "One hundred million seeds",
          "detail": "Ai Weiwei fills Tate's Turbine Hall with hand-painted porcelain seeds, each one identical at a glance and individual up close.",
          "anchorWork": "Sunflower Seeds"
        }
      ],
      "lookFor": [
        {
          "label": "Where you are standing",
          "detail": "Much of this work only exists while you are inside it. Your position and the scale around you are the medium, not the subject."
        },
        {
          "label": "What it is made of",
          "detail": "Porcelain, weathering steel, a brick wall. The material usually carries the argument — Ai Weiwei's seeds mean what they mean because of where porcelain comes from."
        },
        {
          "label": "Who actually made it",
          "detail": "Fabricated by engineering firms, foundries and whole towns of artisans. The artist's own hand is often nowhere in the finished object."
        },
        {
          "label": "Whether it is meant to last",
          "detail": "Tides cover it, councils scrub it off, the steel rusts on purpose. Permanence stopped being the point."
        },
        {
          "label": "The paintings you cannot see here",
          "detail": "Every major painting after 1950 is still in copyright. The works below are sculpture, installation and street art because those are what can be shown — the absence is legal, not editorial."
        }
      ],
      "legacy": "This is the first era on the timeline whose artists are largely still alive, and the first where the images run out. Pollock, Rothko, Warhol and Basquiat sit below as links to the museums that hold them, because copyright reaches roughly seventy years past an artist's death and none of them are far enough away yet. The timeline ends not because art stopped, but because the pictures stop being ours to show."
    },
    "keyArtists": [
      {
        "name": "Ai Weiwei",
        "years": "b. 1957",
        "nationality": "Chinese",
        "epithet": "Scale as argument",
        "bio": "Sculptor, architect and dissident who works at industrial scale, usually with materials that carry Chinese history inside them.",
        "longBio": "The son of the poet Ai Qing, who was denounced and exiled during the Anti-Rightist Movement, Ai Weiwei grew up in internal exile in Xinjiang. He helped design Beijing's Olympic stadium, then publicly disowned the project. His work catalogues state failure — most notably the names of the schoolchildren killed in the 2008 Sichuan earthquake — and he was detained for 81 days in 2011 and had his passport withheld until 2015. Much of his practice depends on traditional Chinese craft carried out by large teams of artisans.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Ai_Weiwei_Rendel.jpg/960px-Ai_Weiwei_Rendel.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Sunflower Seeds",
            "year": "2010",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Ai_Weiwei%27s_Sunflower_Seeds%2C_Tate_Modern_1.jpg/1920px-Ai_Weiwei%27s_Sunflower_Seeds%2C_Tate_Modern_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Under Mao, propaganda showed the people as sunflowers turning towards the sun. Ai gives you a hundred million seeds instead — mass-produced, identical from a distance, every one different in the hand.",
            "sourceCredit": "Tate Modern, London — photograph by Mike Peel, CC BY-SA 4.0",
            "sourceLink": "https://www.tate.org.uk/art/artworks/ai-sunflower-seeds-t13408"
          }
        ]
      },
      {
        "name": "Antony Gormley",
        "years": "b. 1950",
        "nationality": "British",
        "epithet": "The body as a place",
        "bio": "Almost every work starts as a cast of his own body, then gets multiplied, weathered and put somewhere the public cannot avoid it.",
        "longBio": "Gormley studied archaeology and anthropology at Cambridge and spent three years in India studying Buddhism before training as a sculptor. His method has been consistent for four decades: his own body, held still and cast, used less as a self-portrait than as a standard human unit. The results are deliberately sited outside galleries — on a motorway verge, a tidal beach, the rooftops of central London — where they are encountered by people who did not set out to look at sculpture.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Antony_Gormley_portrait.jpg/960px-Antony_Gormley_portrait.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Angel of the North",
            "year": "1998",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Angel_of_the_North_2016_004.jpg/1920px-Angel_of_the_North_2016_004.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The wings are angled twelve degrees forward rather than flat, which Gormley described as creating a sense of embrace. It stands on the site of a former colliery bath house, above the pit workings.",
            "sourceCredit": "Gateshead, Tyne and Wear — photograph by Mike Peel, CC BY-SA 4.0",
            "sourceLink": "https://www.gateshead.gov.uk/article/3957/Angel-of-the-North"
          },
          {
            "title": "Another Place",
            "year": "1997",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Crosby_Beach%2C_Another_Place_by_Antony_Gormley_-_panoramio_%281%29.jpg/1920px-Crosby_Beach%2C_Another_Place_by_Antony_Gormley_-_panoramio_%281%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "One hundred iron figures stand across three kilometres of Crosby Beach, all facing the sea. The tide covers and uncovers them twice a day, so the work is never twice the same and is sometimes not visible at all.",
            "sourceCredit": "Crosby Beach, Merseyside — photograph by Heikki Immonen, CC BY 3.0",
            "sourceLink": "https://www.antonygormley.com/artworks/"
          }
        ]
      },
      {
        "name": "Richard Serra",
        "years": "1938 – 2024",
        "nationality": "American",
        "epithet": "Steel that moves you",
        "bio": "Worked in steel mills before he worked in galleries, and made sculpture heavy enough that walking through it changes how you stand.",
        "longBio": "Serra paid for his art education by working in steel mills, and never really left the material. His sculptures are made of plates weighing many tonnes, curved so that walking between them makes the space narrow and widen unpredictably. His public work drew unusual public anger: Tilted Arc, installed in a New York plaza in 1981, was removed in 1989 after a federal hearing, and Serra always maintained that relocating a site-specific work destroys it.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Oliver_Mark_-_Richard_Serra%2C_Siegen_2005.jpg/960px-Oliver_Mark_-_Richard_Serra%2C_Siegen_2005.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Shift",
            "year": "1970",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Richard_Serra%27s_%22Shift%22_%281970%29_%2815889992437%29.jpg/1920px-Richard_Serra%27s_%22Shift%22_%281970%29_%2815889992437%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Serra set the concrete sections by having two people walk the field until they lost sight of each other. The work maps the exact curvature of the ground rather than being imposed on it.",
            "sourceCredit": "King City, Ontario — photograph by Jason Paris, CC BY 2.0",
            "sourceLink": "https://www.ontario.ca/"
          }
        ]
      },
      {
        "name": "Banksy",
        "years": "b. c. 1974",
        "nationality": "British",
        "epithet": "Anonymous, everywhere",
        "bio": "Stencils painted illegally on public walls, usually overnight, by an artist whose identity has never been confirmed.",
        "longBio": "Working out of Bristol from the early 1990s, Banksy adopted stencils because they cut the time spent exposed at a wall. The identity remains unconfirmed, which is structural rather than coy: the work is criminal damage, and the anonymity is what makes it possible. The pieces are also deliberately precarious — painted over by councils, cut out of walls and sold by others, or in the case of Girl with Balloon, shredded by a mechanism hidden in the frame moments after selling at Sotheby's in 2018.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Banksy_graffiti_on_Newman_Street_-_One_Nation_Under_CCTV.jpg/1920px-Banksy_graffiti_on_Newman_Street_-_One_Nation_Under_CCTV.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "One Nation Under CCTV",
            "year": "2008",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Banksy_graffiti_on_Newman_Street_-_One_Nation_Under_CCTV.jpg/1920px-Banksy_graffiti_on_Newman_Street_-_One_Nation_Under_CCTV.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Painted over three nights from full scaffolding, directly beside a working CCTV camera and within its view. Westminster Council removed it in 2009.",
            "sourceCredit": "Newman Street, London — photograph by VirtuallyLondonBecky, CC BY-SA 4.0",
            "sourceLink": "https://www.banksy.co.uk/"
          }
        ]
      },
      {
        "name": "Yayoi Kusama",
        "years": "b. 1929",
        "nationality": "Japanese",
        "epithet": "Dots without end",
        "bio": "Has painted, printed and installed the same repeating dot for seventy years, following hallucinations she has had since childhood.",
        "longBio": "Kusama has described seeing fields of dots spreading over surfaces since she was a child, and has called her work an attempt to record and survive them. She moved to New York in 1958, staged guerrilla happenings through the 1960s, then returned to Japan in 1973 and has lived voluntarily in a psychiatric hospital in Tokyo since 1977, walking to her studio each day. Her infinity rooms have made her among the most-visited living artists in the world.",
        "portraitUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Yayoi_Kusama_circa_2004.jpg/960px-Yayoi_Kusama_circa_2004.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "works": [
          {
            "title": "Pumpkin",
            "year": "1994",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Yayoi_Kusama_Pumpkin.jpg/960px-Yayoi_Kusama_Pumpkin.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "Kusama has said the pumpkin's shape has comforted her since childhood — she called it charming for its generous unpretentiousness. The yellow one sits on a pier on Naoshima island and has been washed into the sea by typhoons more than once.",
            "sourceCredit": "Naoshima, Japan — photograph by Zlatko, CC0",
            "sourceLink": "https://benesse-artsite.jp/en/"
          },
          {
            "title": "The Obliteration Room",
            "year": "2002 – ongoing",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Yayoi_Kusama_Obliteration_Room.jpg/960px-Yayoi_Kusama_Obliteration_Room.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "factoid": "The room begins entirely white — walls, furniture, piano, everything. Visitors are handed sheets of coloured dot stickers and told to put them anywhere. Over the weeks of a show the room disappears under them.",
            "sourceCredit": "Photograph via Helsinki Art Museum / The Broad, CC BY-SA 4.0",
            "sourceLink": "https://www.thebroad.org/art/yayoi-kusama"
          }
        ]
      }
    ],
    "offsiteWorks": [
      {
        "title": "Autumn Rhythm (Number 30)",
        "artist": "Jackson Pollock",
        "year": "1950",
        "note": "Over five metres wide, made with the canvas flat on the floor and paint poured, flung and dripped from sticks and hardened brushes. Pollock said he could walk around it and be literally in the painting.",
        "holder": "The Metropolitan Museum of Art, New York",
        "link": "https://www.metmuseum.org/art/collection/search/488978"
      },
      {
        "title": "No. 61 (Rust and Blue)",
        "artist": "Mark Rothko",
        "year": "1953",
        "note": "Rothko left instructions that his paintings hang low and be lit dimly, and wanted viewers to stand about forty-five centimetres away so the colour filled their vision. He described the work as being about tragedy and ecstasy, not about colour.",
        "holder": "The Museum of Contemporary Art, Los Angeles",
        "link": "https://www.moca.org/collection"
      },
      {
        "title": "Campbell's Soup Cans",
        "artist": "Andy Warhol",
        "year": "1962",
        "note": "Thirty-two canvases, one for each variety the company then sold, shown in a row on shelves like stock. Warhol said he ate the same soup for lunch every day for twenty years.",
        "holder": "Museum of Modern Art, New York",
        "link": "https://www.moma.org/collection/works/79809"
      },
      {
        "title": "Untitled (Skull)",
        "artist": "Jean-Michel Basquiat",
        "year": "1981",
        "note": "Painted at twenty-one, a few years after he was writing SAMO graffiti on Lower Manhattan walls. The head is part skull, part street map, part anatomical diagram. He died at twenty-seven.",
        "holder": "The Broad, Los Angeles",
        "link": "https://www.thebroad.org/art/jean-michel-basquiat"
      },
      {
        "title": "The Physical Impossibility of Death in the Mind of Someone Living",
        "artist": "Damien Hirst",
        "year": "1991",
        "note": "A fourteen-foot tiger shark suspended in formaldehyde in a steel and glass tank. The original specimen decayed badly and was replaced in 2006, which raised the question of whether the result is still the same artwork.",
        "holder": "Private collection — exhibited internationally",
        "link": "https://www.damienhirst.com/the-physical-impossibility-of"
      }
    ]
  }
]
