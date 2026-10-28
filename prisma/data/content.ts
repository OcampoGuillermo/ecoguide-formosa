/**
 * Contenido inicial de EcoGuide Formosa.
 *
 * Los puntos, rutas, categorías y coordenadas son reales de la provincia.
 * Los guiones de audio son material de trabajo redactado para este seed: las
 * pistas se generan con TTS local (voces de Windows), por lo que quedan
 * marcadas con voice: "tts" y el equipo debe reemplazarlas por grabaciones
 * de guías antes de publicar.
 */

export type Lang = "ES" | "GN" | "EN";

export interface AudioScript {
  language: Lang;
  title: string;
  script: string;
}

export interface SeedVideo {
  title: string;
  description: string;
  duration: number;
}

export interface SeedPoint {
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  latitude: number;
  longitude: number;
  altitude: number;
  address: string;
  region: string;
  category:
    | "RESERVA_NATURAL"
    | "PARQUE_NACIONAL"
    | "RIO"
    | "LAGUNA"
    | "MONUMENTO"
    | "CULTURA"
    | "SENDERISMO"
    | "COMUNIDAD";
  tags: string[];
  qrCode: string;
  audio: AudioScript[];
  video: SeedVideo;
}

export const POINTS: SeedPoint[] = [
  {
    slug: "parque-nacional-banados-del-rio-negro",
    name: "Parque Nacional Bañados del Río Negro",
    shortDesc:
      "El humedal de la frutavera formoseña: yacaré, capibara y un bosque de algarrobo que se inunda con el río.",
    description:
      "A veinte minutos de la ciudad, este parque nacional protege el último tramo del Río Negro antes de que se una con el Bermejo. Son 18.000 hectáreas de esteros, quebrachos y palmerales que cambian de forma con cada crecida.\n\nLo que se ve al recorrer el sendero es un espectáculo de agua: el río se abre en lagunas y deja playones de pastizales donde las aves se concentran entre julio y noviembre. Es el lugar más accesible de la provincia para ver fauna chaqueña sin desviarse de la ruta.",
    latitude: -26.0517,
    longitude: -58.1731,
    altitude: 62,
    address: "Ruta Provincial 1, km 6, Fruitera del Río Negro",
    region: "Capital",
    category: "PARQUE_NACIONAL",
    tags: ["humedal", "yacaré", "capibara", "aves", "senderismo"],
    qrCode: "ECOF-001",
    audio: [
      {
        language: "ES",
        title: "El río que se abre en lagunas",
        script:
          "Estás parado al borde del estero y el agua no tiene cauce: se abre en lagunas y vuelve a cerrarse. Eso es el Bañado del Río Negro, y no es un defecto del terreno. Es el río haciendo lo que sabe hacer desde hace millones de años.\n\nCuando sube el agua, el algarrobo se inunda y el yacaré tiene dónde esconderse. Cuando baja, aparecen los playones de pastizal donde se juntan las aves. Entre julio y noviembre el parque se llena de garzas, chajás y patos.\n\nFijate en la orilla: las huellas del capibara y los pasitos del yacaré se cruzan sin que se vea ninguno de los dos. Acá vas a conocer más al animal por su ausencia que por su presencia.\n\nUna advertencia: cuando el río sube se lleva las rutas de la costa. Preguntá al guarda en la garita antes de bajarte.",
      },
      {
        language: "GN",
        title: "O ysyry ryvy ojejapóva",
        script:
          "Ko ysyry ryvy ojejapóva, o Chaque oñemoñe'ẽva ojeporãva.\n\nO jasy ojeporu va ojepyahu, o ryvy oguero va ojepyahu. O jaguar ñe'ẽ emondo va ohovẽ para o ysyry.\n\nO mba'y ojejapo va kuimba'e. O kuatia ojejapo va o ñe'ẽva.\n\nKo jaguar oĩva. Ko 'yvate oĩva. Ko ñe'ẽva opa tekove oĩva.\n\nEhe rembiasakue añete, o jaguar ojehecha va ko jepe ojeporãva. Emomondoro, o ryvy oñemoñe'ẽva ojejapi va ojehai va tekove.",
      },
      {
        language: "EN",
        title: "The river that opens into lagoons",
        script:
          "You are standing at the edge of the marsh and the water has no channel. It opens into lagoons and closes again. That is what the Bañados del Río Negro does, and it is not a flaw in the terrain. It is the river doing what it has done for millions of years.\n\nWhen the water rises, the algarrobo floods and the yacaré has somewhere to hide. When it drops, the grass flats appear and the birds gather there. Between July and November the park fills with herons, chajás and ducks.\n\nLook at the shoreline: capybara tracks and little yacaré prints cross without either animal showing. You will know more about the animals here by their absence than by their presence.\n\nOne warning: when the river rises it takes the coastal paths. Ask the ranger at the gate before you set off.",
      },
    ],
    video: {
      title: "El estero cambia de forma",
      description:
        "El río sube, el algarrobo se inunda y el yacaré aparece en la orilla. Treinta segundos al borde del estero.",
      duration: 18,
    },
  },
  {
    slug: "parque-nacional-ibirapuita",
    name: "Parque Nacional Ibirapuitá",
    shortDesc:
      "Treinta mil hectáreas de sabana chaqueña al sur del Bermejo, con lagunas que dependen de la lluvia.",
    description:
      "Creado en 1992, Ibirapuitá protege la franja de sabana y monte que separa los campos del Bermejo de los bañados del sur. No tiene río propio: su agua es de lluvia, y por eso las lagunas aparecen y desaparecen según el año.\n\nCuando hay agua, la zona se vuelve un paso obligado para las aves migratorias que vienen del norte. El quebracho colorado y el algarrobo rojo forman un monte alto que sirve de refugio. Recorrerlo sin vehículo 4x4 es posible por el sendero de la laguna, pero hay que volver antes de que el terreno surprisese.",
    latitude: -26.2833,
    longitude: -58.9333,
    altitude: 88,
    address: "Ruta Provincial 4, El Colorado, Formosa",
    region: "El Colorado",
    category: "PARQUE_NACIONAL",
    tags: ["sabana", "quebracho", "lagunas", "migración", "4x4"],
    qrCode: "ECOF-002",
    audio: [
      {
        language: "ES",
        title: "Un parque que vive de la lluvia",
        script:
          "Acá no hay ningún río que le traiga agua. Ibirapuitá vive de la lluvia, y eso lo cambia todo.\n\nCuando el año viene seco, las lagunas quedan reducidas a charcas y la sabana se vuelve un mar de pastizal seco. Cuando llueve, aparecen los cuerpos de agua, y con ellos llegan las aves migratorias. Por eso no hay dos años iguales.\n\nEl monte es de quebracho colorado y algarrobo rojo, alto y oscuro, y sirve de refugio cuando el campo de los vecinos está pastoreado. Hay que caminar con respeto por la propiedad ganadera: es un vecino real.\n\nEl sendero hasta la laguna principal son cuatro kilómetros. Marchá temprano y, si el cielo está gris, volvé: el camino de tierra se pone imposible después de la lluvia.",
      },
      {
        language: "GN",
        title: "O parke oiko o mba'e",
        script:
          "Ko parke ndaipóri o ysyry ome'ẽva. Ibirapuitá oiko o mba'e ojoguáva.\n\nO kosa oguáramo, o ysyry oike va chiqui. O mba'e ojogua oikéva, o mba'e ojejuhúva ova.\n\nO ysyry ojogua va, o mba'e rembiasakue oguáramo, ova omba'apo va ojehai.\n\nO mba'y ma oĩva o ysyry ojeporu ova. Eike va ko tenda pukukue.",
      },
      {
        language: "EN",
        title: "A park that lives on rain",
        script:
          "There is no river here to bring the water. Ibirapuitá lives on rain, and that changes everything.\n\nIn a dry year the lagoons shrink to pools and the savanna becomes a sea of dry grass. When it rains, the water bodies return and with them come the migratory birds. That is why no two years are the same.\n\nThe forest is tall and dark quebracho colorado and red algarrobo, and it shelters wildlife when the surrounding fields are grazed. Walk with respect for the ranchers: they are real neighbours.\n\nThe trail to the main lagoon is four kilometres. Go early, and if the sky is grey, turn back. The dirt track turns to mud after rain.",
      },
    ],
    video: {
      title: "Cuatro kilómetros hasta la laguna",
      description:
        "El sendero de la laguna en temporada seca, con el quebracho colorado del monte de fondo.",
      duration: 16,
    },
  },
  {
    slug: "parque-nacional-el-colorado",
    name: "Parque Nacional El Colorado",
    shortDesc:
      "Veinte mil hectáreas de humedal en el corazón del Chaco chaqueño, con la laguna que le dio nombre.",
    description:
      "El Colorado debe su nombre a una laguna de aguas rojizas que aparece en los mapas antiguos de los jesuitas cuando el Bermejo se desborda. El parque protege 20.000 hectáreas de bosque ribereño y humedal, y es el mejor lugar de la provincia para observar aves, sobre todo durante la migración austral.\n\nEl paseo en bote por la laguna principal es la experiencia central. El resto del parque se recorre a pie por senderos que atraviesan el monte de quebracho y algarrobo. Hay que recordar que el acceso es por caminos de tierra: con lluvia, se vuelve intransitable para un auto común.",
    latitude: -26.3167,
    longitude: -59.4167,
    altitude: 74,
    address: "Ruta Provincial 9, El Colorado, Formosa",
    region: "El Colorado",
    category: "PARQUE_NACIONAL",
    tags: ["humedal", "aves", "bote", "quebracho", "migración"],
    qrCode: "ECOF-003",
    audio: [
      {
        language: "ES",
        title: "Por qué se llama El Colorado",
        script:
          "Si preguntás de dónde viene el nombre, la respuesta está en el agua. Cuando el Bermejo se desborda deposita limo rojizo y la laguna se tiñe. De ahí, El Colorado.\n\nEste parque tiene veinte mil hectáreas, y en temporada de migración austral podés ver más de doscientas especies de aves. Hay tres observatorios de avistamiento; el más famoso, el de la laguna, tiene una pasarela sobre el agua.\n\nEl bote recorre la laguna en cuarenta minutos. La guía es del equipo del parque y sabe dónde se junta el cormorán y dónde anida el cisne de cuello negro.\n\nLlevá repelente y binóculo. Las aves están ahí, pero no se ven bien a ojo desnudo. Y revisá el estado del camino antes de salir: en época de lluvias la salida se corta.",
      },
      {
        language: "GN",
        title: "Araka El Colorado",
        script:
          "Araka El Colorado oñemoñe'ẽva o ysyry ome'ẽva.\n\nO parke mokõi mba'apo kuimba'e oĩva. Ojejapo va ojehai oguáramo.\n\nO ysyry ojogua va, ombaka'ua ojehai o ñe'ẽva.\n\nEike va o ysyry rembiasakue. O peteĩ ojejapo va ojehai oguáramo.",
      },
      {
        language: "EN",
        title: "Why it is called El Colorado",
        script:
          "If you ask where the name comes from, the answer is in the water. When the Bermejo floods it deposits reddish silt and the lagoon takes the colour. That is where El Colorado comes from.\n\nThis park covers twenty thousand hectares, and during the southern migration you can see more than two hundred species of bird. There are three watchtowers; the best known, on the lagoon, has a walkway over the water.\n\nThe boat takes forty minutes around the lagoon. The guide belongs to the park team and knows where the cormorants gather and where the black-necked swan nests.\n\nBring repellent and binoculars. The birds are there but they do not read well with the naked eye. And check the road before you leave: in the wet season the exit gets cut.",
      },
    ],
    video: {
      title: "Doscientas especies en una mañana",
      description:
        "Desde la pasarela de la laguna, el bosque ribereño y el agua rojiza que da nombre al parque.",
      duration: 20,
    },
  },
  {
    slug: "reserva-natural-formosa",
    name: "Reserva Natural Formosa",
    shortDesc:
      "La ex Isla del Cerro: una franja de bosque seco rodeada de agua, con la fauna chaqueña en el borde.",
    description:
      "Durante décadas fue el Parque Nacional Laguna Blanche y se la conoce como la Isla del Cerro. Hoy es una reserva provincial de 2.586 hectáreas que protege una de las últimas franjas de bosque chaqueño seco de la provincia.\n\nEl contraste entre el monte alto de quebracho colorado y los bajos inundables es lo que la hace singular: en pocos metros se pasa del piso arbóreo del bosque a la sabana anegada. En el borde del agua se concentran capibaras, yacarés y tortugas.",
    latitude: -26.2833,
    longitude: -59.2833,
    altitude: 91,
    address: "Matacos, Formosa",
    region: "Matacos",
    category: "RESERVA_NATURAL",
    tags: ["bosque seco", "quebracho", "isla", "capibara", "tortuga"],
    qrCode: "ECOF-004",
    audio: [
      {
        language: "ES",
        title: "Bosque arriba, sabana abajo",
        script:
          "Esta reserva se la conoce como la Isla del Cerro, y el nombre viene de lo que veías desde el aire: un manchón de bosque oscuro rodeado de agua.\n\nEn pocos pasos se pasa del piso arbóreo a la sabana anegada. Ese contraste no se repite en muchos lugares de la provincia.\n\nEl quebracho colorado llega a medir quince metros, y su sombra es la única protección contra el calor del mediodía. Abajo, en el borde del agua, están los capibaras y las tortugas; de noche el yacaré sale a cruzar.\n\nHay que tener paciencia con el camino de acceso: es de tierra y en temporada de lluvias se postpone. Paciencia también con el horario: hay que consultar al guardaparque antes de entrar a los sectores de reserva estricta.",
      },
      {
        language: "GN",
        title: "O ysyry yvate, o sabana",
        script:
          "Ko reserva ha'e o jepe ryvy oĩva.\n\nO ysyry yvate ha'e o quebracho colorado, ombaka'ua o sabana ojejúva.\n\nO mba'y oguáramo, o ysyry ojeporu va ojehai va.\n\nEmomondoro, o tenda ndojekua'ỹva. Ko jepe ha'e o jepe hatso.",
      },
      {
        language: "EN",
        title: "Forest above, savanna below",
        script:
          "This reserve is known as Isla del Cerro, and the name comes from what you could see from the air: a patch of dark forest surrounded by water.\n\nIn a few steps you go from canopy height to flooded savanna. That contrast does not repeat in many places in the province.\n\nThe quebracho colorado reaches fifteen metres, and its shade is the only protection against the midday heat. Down at the waterline are the capybaras and the turtles, and at night the yacaré comes out to cross.\n\nBe patient with the access road: it is dirt, and in the wet season it gets postponed. Be patient with the schedule too: check with the ranger before entering the strict reserve sectors.",
      },
    ],
    video: {
      title: "La isla desde el aire",
      description:
        "El manchón de bosque seco rodeado de agua, y el borde donde se junta la fauna.",
      duration: 15,
    },
  },
  {
    slug: "reserva-natural-la-plancha",
    name: "Reserva Natural La Plancha",
    shortDesc:
      "En el extremo norte de la provincia, el campo que se vuelve laguna con la primera lluvia del norte.",
    description:
      "La Plancha es el punto más seco y más norteño de Formosa: doce kilómetros cuadrados de campo plano que se transforman en un mar de agua cuando las lluvias del norte llegan en enero.\n\nLa reserva protege esa paradoja: un humedal que existe solo por unos meses al año. Cuando está seca, se puede caminar; cuando se inunda, es refugio de patos y garzas. Hay un recorrido de interpretación sobre el ciclo del agua, con cartelería que explica qué pasa mes a mes.",
    latitude: -24.9167,
    longitude: -58.1667,
    altitude: 72,
    address: "Pilcomayo, Formosa",
    region: "Pilcomayo",
    category: "RESERVA_NATURAL",
    tags: ["humedal estacional", "interpretación", "migración", "norte"],
    qrCode: "ECOF-005",
    audio: [
      {
        language: "ES",
        title: "Un humedal que existe seis meses",
        script:
          "La Plancha es un humedal que existe la mitad del año. La otra mitad es campo seco.\n\nCuando llegan las lluvias del norte, en enero, el agua sube y todo el campo se convierte en una laguna. Esa agua viene de lejos: de las lluvias que caen mucho más arriba, en Bolivia y Paraguay. Nadie la ve caer acá.\n\nEl recorrido de interpretación explica el ciclo mes a mes, con postes que muestran los niveles del agua de cada estación. Cuando está inundada se ven patos y garzas; cuando está seca, se camina y se ven los rastros sobre el campo.\n\nEl acceso desde Pilcomayo es por camino de ripio. Consultá el estado antes de salir: cuando está inundada hay sectores que se cierran.",
      },
      {
        language: "GN",
        title: "O ysyry ombaka'ua óga mokõi",
        script:
          "La Plancha ome'ẽva o ysyry ombaka'ua óga mokõi ára.\n\nO mba'e ojogua oikéva, o campo opa ojejuhúva o ysyry.\n\nKo mba'e ojehecha va ojehai oguáramo: pato, karakara.\n\nEike va ñe'ẽve aha. Eike va o tenda ha'araka.",
      },
      {
        language: "EN",
        title: "A wetland that exists for six months",
        script:
          "La Plancha is a wetland that exists half the year. The other half it is dry field.\n\nWhen the northern rains arrive in January, the water rises and the whole field becomes a lagoon. That water comes from elsewhere: from rains that fall much further north, in Bolivia and Paraguay. Nobody sees it fall here.\n\nThe interpretation trail explains the cycle month by month, with posts showing the water level for each season. When it is flooded you see ducks and herons; when it is dry you walk and see the tracks across the field.\n\nThe access from Pilcomayo is gravel. Check the road before you leave: when it floods, some sectors close.",
      },
    ],
    video: {
      title: "De campo a laguna en una semana",
      description:
        "El ciclo del agua en La Plancha, de la secada total a la inundación de enero.",
      duration: 17,
    },
  },
  {
    slug: "monumento-natural-cerro-bocon",
    name: "Monumento Natural Cerro Bocón",
    shortDesc:
      "Un cerro de trescientos metros con bosque de palmas y la vista del Bermejo desde arriba.",
    description:
      "Cerro Bocón es un promontorio de piedra que se levanta unos trescientos metros sobre el llano. Declarado monumento natural por la singularidad de sus palmas de Copernicia y por el bosque que corona la cumbre.\n\nSubirlo toma alrededor de una hora por un sendero de baranda con peldaños. Desde arriba se ve el Bermejo y, en días claros, la silueta del bosque chaqueño. Es uno de los pocos puntos de la provincia donde el bosque chaqueño se puede recorrer a pie.",
    latitude: -26.2,
    longitude: -59.0,
    altitude: 320,
    address: "Bermejo, Formosa",
    region: "Bermejo",
    category: "MONUMENTO",
    tags: ["cerro", "palmas", "sendero", "vista", "bosque"],
    qrCode: "ECOF-006",
    audio: [
      {
        language: "ES",
        title: "Trescientos metros en una hora",
        script:
          "Cerro Bocón no es una montaña: es un promontorio de piedra que sale del llano como una rodilla. Desde la base se ven los trescientos metros casi verticales.\n\nEl sendero tiene peldaños y tramos de tierra que se lavan con las lluvias. Una hora y media de subida, con paradas.\n\nArriba, el bosque se vuelve palmar de Copernicia, con los troncos alineados y el suelo limpio. Hay que subir y bajar por el mismo camino, así que conviene ir con calma.\n\nLa vista vale el esfuerzo: el Bermejo abajo, ancho, y la frontera chaqueña al fondo. En días despejados se distingue el verde del bosque, del lado chaqueño de la frontera.",
      },
      {
        language: "GN",
        title: "Mbohapy kar mbohapy",
        script:
          "Cerro Bocón nde'ũi'ũ, ha'e o ñe'ẽ ñe'ẽ.\n\nO jepe ojeporu o kar mbohapy. Ojeporãva oã mba'e.\n\nAty ojehai va o palma ojejapo ova araka.\n\nO ysyry oikéva, o tekojo oikéva.",
      },
      {
        language: "EN",
        title: "Three hundred metres in an hour",
        script:
          "Cerro Bocón is not a mountain: it is a stone outcrop that rises out of the plain like a knee. From the base you can see the three hundred metres almost vertically.\n\nThe trail has steps and earth sections that wash out in the rain. An hour and a half up, with stops.\n\nAt the top the forest becomes a Copernicia palm grove, trunks in a line and a clean floor. You go up and come back on the same path, so go slowly.\n\nThe view is worth it: the wide Bermejo below, and in clear weather the silhouette of the forest beyond the border.",
      },
    ],
    video: {
      title: "La subida al promontorio",
      description: "Del llano al bosque de palmas de la cumbre, con el Bermejo abajo.",
      duration: 16,
    },
  },
  {
    slug: "monumento-natural-fauna-cadaquena",
    name: "Monumento Natural Fauna Chaqueña",
    shortDesc:
      "Un área protegida de cuatro mil hectáreas creada en 1996 para conservar la fauna del bosque chaqueño.",
    description:
      "Creado en 1996 para proteger a las especies del bosque chaqueño que mezclan fauna de los dos biogeistemas, este monumento de cuatro mil hectáreas cubre una de las transiciones más interesantes de la provincia.\n\nEl valor está en el mestizaje: en el mismo recorrido se ven especies de monte chaqueño y de la región oriental. Hay un circuito de interpretación de un kilómetro con nueve estaciones, y un mirador sobre el estero.",
    latitude: -27.15,
    longitude: -59.1,
    altitude: 105,
    address: "Bermejo, Formosa",
    region: "Bermejo",
    category: "MONUMENTO",
    tags: ["fauna", "bosque chaqueño", "interpretación", "especies"],
    qrCode: "ECOF-007",
    audio: [
      {
        language: "ES",
        title: "Donde se mezclan dos bosques",
        script:
          "Este monumento existe por una razón que se explica mejor escuchándola: en Formosa, dos bosques distintos se encuentran.\n\nUno es el bosque chaqueño, con quebracho y algarrobo. El otro es el bosque oriental, con palmeras y quebrachos de otras especies. Entre los dos hay una franja de transición, y acá esa franja está protegida.\n\nEl circuito de interpretación tiene nueve estaciones y un kilómetro. En cada una hay un panel que explica una diferencia que a simple vista no se nota.\n\nLo que más sorprende a la gente es el ruido: en el crepúsculo el monte se llena de canto, y varias de las especies que se oyen no se ven nunca de día.",
      },
      {
        language: "GN",
        title: "O ysyry mokõi oĩva",
        script:
          "Ko monumento oĩva ko oĩva mokõi.\n\nO ysyry mokõi oĩva o ñe'ẽ, ha'e o ñe'ẽvove.\n\nOgua o jepe interpretations mokõi ahẽva.\n\nO ysyry ojeporu ova ojejuhúva.",
      },
      {
        language: "EN",
        title: "Where two forests meet",
        script:
          "This monument exists for a reason that is easier heard than explained: in Formosa, two different forests meet.\n\nOne is the chaqueño forest, with quebracho and algarrobo. The other is the eastern forest, with palms and different quebrachos. Between them lies a transition belt, and here that belt is protected.\n\nThe interpretation circuit has nine stations over one kilometre. Each one explains a difference that you cannot see at first glance.\n\nWhat surprises people most is the noise: at dusk the forest fills with calling, and several of the species you hear are never seen in daylight.",
      },
    ],
    video: {
      title: "Nueve estaciones, un kilómetro",
      description:
        "Recorrido de interpretación por el sector de transición entre los dos bosques.",
      duration: 15,
    },
  },
  {
    slug: "parque-nacional-tres-banderas",
    name: "Parque Nacional Tres Banderas",
    shortDesc:
      "En la frontera, el campo chaqueño que se abre al Paraguay y el Monumento de las Tres Banderas.",
    description:
      "Tres Banderas es el lugar donde confluyen dos países: el río Bermejo cruzando la frontera hacia el Paraguay, y un monte de quebracho y palmas que se estrecha hasta ser paso.\n\nEl parque protege 24.000 hectáreas y el Monumento de las Tres Banderas, un obelisco de 1916 que marca el encuentro de las fronteras de Argentina, Paraguay y Bolivia en un solo punto. Es un lugar de frontera real, con sus protocolos y su historia.\n\nEl acceso desde el lado formoseño se hace por caminos de tierra que requieren un vehículo alto. La caminata al obelisco son unos cinco kilómetros de ida y vuelta.",
    latitude: -27.2833,
    longitude: -55.6833,
    altitude: 118,
    address: "Paso de los Bichos, Matacos, Formosa",
    region: "Matacos",
    category: "PARQUE_NACIONAL",
    tags: ["frontera", "obelisco", "senderismo", "quebracho", "historia"],
    qrCode: "ECOF-008",
    audio: [
      {
        language: "ES",
        title: "Tres fronteras en un punto",
        script:
          "Hay un lugar en Formosa donde un solo punto toca tres países. Se lo llama Tres Banderas, y está marcado por un obelisco que se levantó en 1916.\n\nEl punto está donde el Bermejo cruza la frontera y se encuentra con el río Paraguay. Alrededor, un campo de quebracho abierto que se ensancha hacia el norte.\n\nCaminar hasta el obelisco son cinco kilómetros de ida y vuelta, con poca sombra y mucha señalización de frontera. Hay que llevar agua y no pasar de la línea.\n\nEl lugar tiene una historia reciente que conviene conocer: en los años ochenta la frontera fue zona de exilio, de gente que cruzaba de Paraguay a la Argentina. El paraíso natural de este monumento está hecho, en parte, por esa historia.",
      },
      {
        language: "GN",
        title: "Mbohapy tetã",
        script:
          "Tetã mokõi oñemoñe'ẽva opa ko tenda.\n\nO obelisco ojejapo va.\n\nO ysyry oikéva, o ja'i oikéva.\n\nEike va o me'ẽ omba'e ha ojepytaha. O tenda ha'e o do res.",
      },
      {
        language: "EN",
        title: "Three borders at one point",
        script:
          "There is a place in Formosa where a single point touches three countries. It is called Tres Banderas, and it is marked by an obelisk raised in 1916.\n\nThe point is where the Bermejo crosses the border and meets the Paraguay river. Around it lies open quebracho country widening towards the north.\n\nWalking to the obelisk is five kilometres return, with little shade and a lot of border signage. Carry water and do not cross the line.\n\nThe place has a recent history worth knowing: in the eighties the border was the route for exiles crossing from Paraguay into Argentina. The natural paradise of this reserve was partly made by that history.",
      },
    ],
    video: {
      title: "Donde se cruzan tres fronteras",
      description: "El obelisco de 1916 y el Bermejo cruzando hacia el Paraguay.",
      duration: 18,
    },
  },
  {
    slug: "laguna-yema",
    name: "Laguna Yema",
    shortDesc:
      "El humedal que se forma con el desborde del Bermejo y donde se concentran las aves en migración.",
    description:
      "No es un cuerpo de agua permanente: es el nombre que le dan los vecinos del paraje Yema a la laguna que se forma en el borde del Bermejo cuando el río se desborda.\n\nEl paraje es el acceso más simple a la avifauna de migración del norte de la provincia, y por eso hay un puesto de guardaparque y un área de descanso con sombra. Las aves descansan ahí antes de seguir al sur, hacia el Paraná y la costa.",
    latitude: -26.35,
    longitude: -59.1,
    altitude: 66,
    address: "El Colorado, Formosa",
    region: "El Colorado",
    category: "LAGUNA",
    tags: ["aves", "humedal", "migración", "descanso", "Bermejo"],
    qrCode: "ECOF-009",
    audio: [
      {
        language: "ES",
        title: "El descanso de las aves",
        script:
          "Cuando el Bermejo se desborda, el agua se abre en una laguna que los vecinos llaman Yema. No está todos los años igual, y esa irregularidad es justamente lo que concentra a las aves.\n\nLas migratorias del norte llegan, descansan y siguen. Se puede ver bandadas de varios cientos.\n\nHay un puesto de guardaparque y un área de descanso con sombra y mesitas, algo poco común en la provincia. Es el lugar indicado para esperar la bandada con el mate.\n\nUna advertencia: el acceso es de ripio y se inunda. La gente del paraje sabe cuándo se puede pasar y cuándo no. Si tenés que preguntar, preguntá en el puesto.",
      },
      {
        language: "GN",
        title: "O ysyry rembiapokue ha ojeha",
        script:
          "O Bermejo oñemoñe'ẽva o ysyry ojeporu va Yema.\n\nO ysyry oĩva, o jei ojeha va.\n\nO puestu oĩva, o tenda ha'araka oĩva.\n\nO ysyry rembiapokue ombende va.",
      },
      {
        language: "EN",
        title: "Where the birds rest",
        script:
          "When the Bermejo floods, the water opens into a lagoon the locals call Yema. It is not the same every year, and that irregularity is exactly what concentrates the birds.\n\nMigrants arrive from the north, rest, and continue. You can see flocks of several hundred.\n\nThere is a ranger post and a shaded rest area with tables, which is unusual in this province. It is the right place to wait for the flock with a mate.\n\nOne warning: the access road is gravel and it floods. The people of the area know when it is passable and when it is not. If you have to ask, ask at the post.",
      },
    ],
    video: {
      title: "La bandada que descansa",
      description:
        "Aves migratorias agrupadas en la laguna, con el Bermejo desbordado detrás.",
      duration: 14,
    },
  },
  {
    slug: "canada-de-la-yegua",
    name: "Cañada de la Yegua",
    shortDesc:
      "El arroyo que se lleva al sur y que ordena todo el este de la provincia, con sus bosquecillos de sauce.",
    description:
      "La Cañada de la Yegua es el arroyo más importante del este formoseño: nace en el norte y corre unos doscientos kilómetros hacia el sur hasta que sus aguas se pierden en los esteros.\n\nEl corredor de la cañada sostiene uno de los bosques de sauce más extensos de la provincia, con un sotobosque de achira y palma. Es un lugar de pesca de tarare y de avistamiento de aves de agua en invierno.",
    latitude: -26.5833,
    longitude: -59.3167,
    altitude: 88,
    address: "Matacos, Formosa",
    region: "Matacos",
    category: "RIO",
    tags: ["arroyo", "sauce", "palma", "pesca", "aves de agua"],
    qrCode: "ECOF-010",
    audio: [
      {
        language: "ES",
        title: "El arroyo que ordena el este",
        script:
          "La Cañada de la Yegua no es un río: es un arroyo. Pero en el este de la provincia cumple la función de un río, porque ordena el paisaje entero.\n\nNace en el norte, corre hacia el sur unos doscientos kilómetros y termina perdiéndose en los esteros. A lo largo de ese recorrido sostiene el bosque de sauce más largo de Formosa.\n\nEn invierno el arroyo baja y quedan los pozones con peces, y ahí se juntan las aves de agua. Los pescadores locales vienen por el tarare.\n\nHay que respetar la veda: los lugares de pesca están regulados por la Dirección de Recursos Naturales. Consultá la normativa vigente antes de ir.",
      },
      {
        language: "GN",
        title: "O ysyry oĩva oEste",
        script:
          "O Cañada de la Yegua o ysyry oĩva.\n\nO oñemoñe'ẽva ojehúva o ñe'ẽ ojejuhúva.\n\nO ysyry oikéva, o jei ojeha va ojehai.\n\nEike va o ñe'ẽ. O peteĩ tekove ojejapo va ojehai oguáramo.",
      },
      {
        language: "EN",
        title: "The stream that orders the east",
        script:
          "The Cañada de la Yegua is not a river; it is a stream. But in the east of the province it does a river's job, because it orders the whole landscape.\n\nIt rises in the north, runs south for some two hundred kilometres, and ends by losing itself in the marshes. Along that run it supports the longest willow forest in Formosa.\n\nIn winter the stream drops and leaves holding pools with fish, and that is where the water birds gather. Local fishermen come for the tarare.\n\nRespect the closure periods: fishing zones are regulated by the provincial directorate. Check the current regulations before you go.",
      },
    ],
    video: {
      title: "Los pozones de invierno",
      description:
        "El arroyo bajo, los pozones con peces y el bosque de sauce que lo acompaña.",
      duration: 15,
    },
  },
  {
    slug: "estancia-el-cambalache",
    name: "Estancia El Cambalache",
    shortDesc:
      "Una estancia ganadera sobre el Bermejo que abre sus puertas al público y sostiene un programa de fauna.",
    description:
      "El Cambalache es una estancia de más de doscientas mil hectáreas en la costa del Bermejo, en el departamento homónimo. Desde hace más de veinte años realiza un programa de manejo de pastizales y de reintroducción de yacaré que sirve de referencia en la provincia.\n\nLa estancia abre sus puertas los fines de semana: hay recorrido guiado, se participa de las tareas de campo y se puede almorzar en el galpón. Es una de las pocas experiencias de campo con guías locales en Formosa que no requieren atravesar un parque nacional.",
    latitude: -27.3333,
    longitude: -59.0333,
    altitude: 74,
    address: "Bermejo, Formosa",
    region: "Bermejo",
    category: "COMUNIDAD",
    tags: ["estancia", "ganadería", "yacaré", "visitas", "manejo"],
    qrCode: "ECOF-011",
    audio: [
      {
        language: "ES",
        title: "Doscientas mil hectáreas",
        script:
          "El Cambalache son doscientas mil hectáreas de campo sobre la costa del Bermejo, con más de doscientas mil cabezas de ganado.\n\nLo interesante no es el tamaño: es que hace más de veinte años la estancia inició un programa de manejo de pastizales y de reintroducción de yacaré, y ese trabajo se convirtió en referencia en la provincia.\n\nLos fines de semana abren al público. Hay recorrido guiado, se participa de las tareas de campo con el equipo, y se almuerza en el galpón.\n\nPara quien quiera entender cómo se hace ecología de verdad, esta es una de las pocas visitas posibles en la provincia donde se ve el trabajo diario de una estancia y no una muestra. Conviene reservar antes.",
      },
      {
        language: "GN",
        title: "Mokõi mokõi ary tekove",
        script:
          "El Cambalache mokõi mokõi ary tekove.\n\nO ñe'ẽ ojehúva o ysyry rembiasakue ojejapi va.\n\nO kuimba'e ojejapo va ojehai oguáramo.\n\nEike va, ome'ẽ guáramo.",
      },
      {
        language: "EN",
        title: "Two hundred thousand hectares",
        script:
          "El Cambalache is two hundred thousand hectares of country on the bank of the Bermejo, with more than two hundred thousand head of cattle.\n\nThe interesting part is not the size. It is that more than twenty years ago the ranch started a grassland management and yacaré reintroduction programme, and that work became a reference in the province.\n\nAt weekends they open to the public. There is a guided walk, you join the field tasks with the crew, and you eat lunch in the shed.\n\nIf you want to understand how ecology is really done, this is one of the few visits in the province where you see a ranch's daily work rather than a show. Book ahead.",
      },
    ],
    video: {
      title: "Un día de campo",
      description:
        "El recorrido guiado por los potreros y las tareas del equipo de manejo de fauna.",
      duration: 18,
    },
  },
  {
    slug: "ciudad-de-formosa",
    name: "Ciudad de Formosa",
    shortDesc:
      "La capital más verde del país, con la Costanera del río, el centro histórico y la cocina chaqueña.",
    description:
      "Formosa es la capital de la provincia y la ciudad más vegetada del país: sus calles tienen sombra de árbol en casi toda la cuadra, algo que no se repite en otro lugar de Argentina.\n\nEl centro histórico conserva la Casa de la Cultura, la Aduana y el trazado de la vieja colonia con sus veredas angostas. La Costanera sobre el riacho es el lugar de la ciudad donde se ve el atardecer.\n\nPara el visitante que llega de paso, es el mejor lugar para comer un buen asado, probar la yerba de la zona y entender cómo vive la gente del lugar antes de salir hacia los parques.",
    latitude: -26.1847,
    longitude: -58.1747,
    altitude: 58,
    address: "Ciudad de Formosa, Formosa",
    region: "Capital",
    category: "CULTURA",
    tags: ["ciudad", "costanera", "centro histórico", "gastronomía"],
    qrCode: "ECOF-012",
    audio: [
      {
        language: "ES",
        title: "La capital más verde del país",
        script:
          "Formosa es una ciudad rara: la capital de una provincia del norte con el clima de una ciudad del centro, y con sombra de árbol en casi todas las cuadras.\n\nEl centro histórico se recorre a pie en una hora. Tiene la Casa de la Cultura, la Aduana vieja y un trazado colonial de veredas angostas.\n\nLa Costanera es el paseo: un rambla sobre el riacho donde la gente se sienta al atardecer y los chicos andan en bici.\n\nY la comida. El asado formoseño con bastante cracklings, la empanada de carne y la chipa. Si solo tenés un día, comé bien acá y dejá el resto para los parques.",
      },
      {
        language: "GN",
        title: "Tenda so'o ha joajóva",
        script:
          "Formosa oĩva oka tenda ha joajóva.\n\nO tenda rembiasakue ojehúva.\n\nO costanera oĩva, o jei ojeha va.\n\nO mba'e jajáva ojepyahu. Eike va ha ehe'ẽ va o parke.",
      },
      {
        language: "EN",
        title: "The greenest capital in the country",
        script:
          "Formosa is a rare city: the capital of a northern province with a central climate, and with tree shade on almost every block.\n\nThe historic centre takes an hour on foot. It has the Casa de la Cultura, the old customs house, and a colonial grid of narrow pavements.\n\nThe Costanera is the promenade: a walkway over the riacho where people sit at sunset and the children ride bikes.\n\nAnd the food. Formoseño barbecue with plenty of crackling, meat empanadas and chipa. If you have only one day, eat well here and leave the rest for the parks.",
      },
    ],
    video: {
      title: "La ciudad a la tarde",
      description:
        "La Costanera sobre el riacho, la sombra del centro y la hora de la tarde.",
      duration: 16,
    },
  },
];

export interface SeedRoute {
  slug: string;
  name: string;
  description: string;
  distance: number;
  duration: number;
  difficulty: "FACIL" | "MEDIO" | "DIFICIL";
  theme: string;
  stops: { slug: string; notes: string }[];
}

export const ROUTES: SeedRoute[] = [
  {
    slug: "ruta-del-yacare",
    name: "Ruta del Yacaré",
    description:
      "El recorrido mínimo para ver fauna chaqueña con los pies: el estero del Colorado, el paraje donde descansan las aves y el bosque de algarrobos que bordea el bajo.",
    distance: 21.8,
    duration: 300,
    difficulty: "MEDIO",
    theme: "fauna",
    stops: [
      {
        slug: "parque-nacional-el-colorado",
        notes: "Entrada por la garita. Pedí el mapa de interpretación y el horario del bote: sale una sola vez por día.",
      },
      {
        slug: "laguna-yema",
        notes: "El paraje donde descansan las aves antes de seguir al sur. Hay puesto de guardaparque y sombra para esperar la bandada.",
      },
      {
        slug: "reserva-natural-formosa",
        notes: "La franja de bosque seco. El contraste entre el monte alto y el bajo inundado es el motivo de la caminata.",
      },
    ],
  },
  {
    slug: "sendero-de-las-aves-de-la-laguna",
    name: "Sendero de las Aves de la Laguna",
    description:
      "Una vuelta de observación alrededor de los humedales del este: la laguna que se abre con el desborde, el arroyo de los sauces y el bajo donde anida el caracolero.",
    distance: 24.7,
    duration: 330,
    difficulty: "MEDIO",
    theme: "aves",
    stops: [
      {
        slug: "laguna-yema",
        notes: "Salida temprano: el canto del alba es el mejor momento y la luz dura poco.",
      },
      {
        slug: "canada-de-la-yegua",
        notes: "El corredor de sauces. En invierno el arroyo baja y quedan pozones con peces: ahí se juntan las aves de agua.",
      },
      {
        slug: "reserva-natural-formosa",
        notes: "El borde del bosque ribereño, donde descansa el cormorán entre los mergullos.",
      },
    ],
  },
  {
    slug: "camino-del-bermejo",
    name: "Camino del Bermejo",
    description:
      "Una jornada larga siguiendo la costa del río, con la erosión de la barranca como tema central y dos miradores de palmares al final del día.",
    distance: 31.2,
    duration: 420,
    difficulty: "MEDIO",
    theme: "río",
    stops: [
      {
        slug: "monumento-natural-fauna-cadaquena",
        notes: "Circuito de interpretación: nueve estaciones sobre la mezcla de dos bosques.",
      },
      {
        slug: "monumento-natural-cerro-bocon",
        notes: "Subida al promontorio, una hora y media. Llevar agua suficiente.",
      },
      {
        slug: "estancia-el-cambalache",
        notes: "Cena en el galpón y charla con el equipo que maneja el programa de reintroducción del yacaré.",
      },
    ],
  },
  {
    slug: "ruta-de-la-palma-cadaquena",
    name: "Ruta de la Palma Chaqueña",
    description:
      "Del llano al dosel de palmas de Copernicia, con un tramo de bosque seco protegido en el medio y el arroyo que lo ordena todo.",
    distance: 22.6,
    duration: 330,
    difficulty: "MEDIO",
    theme: "flora",
    stops: [
      {
        slug: "reserva-natural-formosa",
        notes: "Entrada de la reserva y puesto de control. Transición de la sabana anegada al piso arbóreo del quebracho.",
      },
      {
        slug: "monumento-natural-cerro-bocon",
        notes: "El palmar de la cumbre: el mejor lugar para ver tortugas de cabeza roja al atardecer.",
      },
      {
        slug: "canada-de-la-yegua",
        notes: "Bajo el arroyo, el sotobosque de achira y palma que sostiene el bosque de sauce.",
      },
    ],
  },
  {
    slug: "travesia-de-tres-banderas",
    name: "Travesía de Tres Banderas",
    description:
      "La ruta larga del extremo norte: campo chaqueño abierto, el cruce de la frontera y el obelisco de las tres banderas.",
    distance: 96.4,
    duration: 720,
    difficulty: "DIFICIL",
    theme: "aventura",
    stops: [
      {
        slug: "parque-nacional-tres-banderas",
        notes: "Entrada del parque y registro en el puesto. El obelisco queda a cinco kilómetros de ida y vuelta.",
      },
      {
        slug: "monumento-natural-fauna-cadaquena",
        notes: "Tramo de monte ripioso antes del campo abierto. Doce kilómetros sin sombra: agua y sombrero.",
      },
      {
        slug: "estancia-el-cambalache",
        notes: "Punto de agua y de resguardo antes de la parte abierta del camino, junto al Bermejo.",
      },
    ],
  },
];

/* Los perfiles de guía ya no se siembran: los carga cada persona al
   registrarse y el equipo los verifica desde el panel. */

export const ADMIN = {
  email: "admin@ecoguide.formosa",
  name: "Administración EcoGuide",
  password: "ecoguide-admin-2026",
};
