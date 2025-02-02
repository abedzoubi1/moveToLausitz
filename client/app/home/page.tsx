import Footer from "../components/footer";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import SectionCarousel from "../components/sectionCarousel";

export default function HomaPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div>
        <SectionCarousel
          title="Veranstaltungen"
          items={[
            {
              id: 84,
              title: "RangerTour: Durch den Inneren Unterspreewald",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://eingabe.events-in-brandenburg.de/images/itempics/2/6/8/item_790862_pic_1_orig.jpg",
            },
            {
              id: 9,
              title: "Open-Air Sommertheater für Familien - Die Regentrude",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://eingabe.events-in-brandenburg.de/images/itempics/2/4/4/item_875442_pic_1_orig.jpg",
            },
            {
              id: 1136,
              title:
                "Luckauer Teilemarkt mit Oldtimertreffen & Maxi-Herbst-Mix",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://eingabe.events-in-brandenburg.de/images/itempics/3/6/4/item_874463_pic_2_orig.jpg",
            },
            {
              id: 8,
              title: "Morgentau & Rosenduft – mit allen Sinnen genießen",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://eingabe.events-in-brandenburg.de/images/itempics/5/7/0/item_857075_pic_1_orig.jpg",
            },
            {
              id: 96,
              title:
                "Mit heißem Wachs und Federkiel – Offene Ostereierwerkstatt",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://eingabe.events-in-brandenburg.de/images/itempics/6/7/9/item_793976_pic_1_orig.jpg",
            },
          ]}
          table={"events"}
        />
        <SectionCarousel
          title="Turist-Informationzentren"
          items={[
            {
              id: 1,
              title: "Tourist-Information Finsterwalde",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/542421",
            },
            {
              id: 2,
              title: "Naturpark-Info des Naturparks Niederlausitzer Landrücken",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/517513",
            },
            {
              id: 3,
              title: "Forster Bahnhof",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/502574",
            },
            {
              id: 4,
              title: "Tourist-Information Dahme/Mark",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/484506",
            },
            {
              id: 5,
              title: "Tourist-Information Luckau",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/330659",
            },
            {
              id: 6,
              title: "Touristinformation Oberspreewald in Straupitz",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/542522",
            },
          ]}
          table={"tourist-info"}
        />
        <SectionCarousel
          title="Kultur"
          items={[
            {
              id: 151,
              title: "Vogelbeobachtungsturm am Wussegk",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/261447",
            },
            {
              id: 152,
              title: "Johanneskirche",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/246478",
            },
            {
              id: 153,
              title: "Atelier Christine Geiszler",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/541797",
            },
            {
              id: 154,
              title: "Naturpark-Info des Naturparks Niederlausitzer Landrücken",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/517513",
            },
            {
              id: 155,
              title: 'Freilichtmuseum "Zeitsprung" Klinge',
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/542336",
            },
            {
              id: 156,
              title:
                "Altes Pfarrhaus Groß Döbbern – Ein Ort der Geschichte und Begegnung",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/554735",
            },
          ]}
          table={"museums"}
        />
        <SectionCarousel
          title="Wandern"
          items={[
            {
              id: 3,
              title: "Kamenz-Stolpen",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=https://dam.destination.one/2723803/a27bbbbc7f1b6c2a77e2784b5e46b3fa95e1c6043ccca5a174eb74b5e9bd3af2/waldhaus-kleiner-stern.jpg",
            },
            {
              id: 4,
              title: "Dubringer-Moor-Tour",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=https://dam.destination.one/2717693/c8c2f6f77db42d2d9066298036d20ce221fdfd969d5736364f483ac35708c35f/marktplatz-wittichenau.jpg",
            },
            {
              id: 27,
              title: "Auf der Spur der stillen Gewässer",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/545443}",
            },
            {
              id: 5,
              title: "Landschaft zwischen Wasserschloss & Industriekultur",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/543961}",
            },
            {
              id: 6,
              title: "Wander- und Radtour „Rund um Lübben“",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/519085}",
            },
            {
              id: 7,
              title: "Elsterradtour",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/472668",
            },
          ]}
          table={"trails"}
        />
        <SectionCarousel
          title="Gastronomie"
          items={[
            {
              id: 1,
              title: 'Hofrestaurant "Zum Schlangenkönig"',
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/519256",
            },
            {
              id: 2,
              title: "Mosquito",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/548556",
            },
            {
              id: 3,
              title: "Gasthaus Wotschofska",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/184617",
            },
            {
              id: 4,
              title: "Hipo's Beachbar",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/484357",
            },
            {
              id: 6,
              title: "Eiscafé Eispause",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/480410",
            },
            {
              id: 8,
              title: "Eiscafé Liska",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/481714",
            },
            {
              id: 9,
              title: "Restaurant im Strandhotel Senftenberger See",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/148238",
            },
          ]}
          table={"food"}
        />
        <SectionCarousel
          title="Unterkünfte"
          items={[
            {
              id: 1,
              title: "Ferienhaus Stoppa, Dietmar",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/471940",
            },
            {
              id: 2,
              title: "Parkplatz Dr.-Wilhelm-Külz-Straße in Hoyerswerda",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/462532}",
            },
            {
              id: 3,
              title: 'KrabatResidenz "Spreewaldperle"',
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/225781",
            },
            {
              id: 4,
              title: 'Zimmervermietung "Zum Grünen Baum"',
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/498553",
            },
            {
              id: 20,
              title: "Camp Casel",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/476940",
            },
            {
              id: 6,
              title: "Spreewaldhaus Anita",
              image:
                "https://img.ecmaps.de/remote/.jpg?project=dzt&mode=max&width=1920&height=1920&url=http://backoffice2.reiseland-brandenburg.de/rpcServer/public/file/get/id/259970",
            },
          ]}
          table={"accommodation"}
        />
        <Footer />
      </div>
    </>
  );
}
