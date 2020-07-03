[English](README.md) :point_left:

[![Ikona kalendarza](./readme-assets/logo128.png)](https://grafik.brzozko.pl/)

# Grafik pracy

> Progresywna aplikacja webowa (PWA), z panelem administracyjnym, przedstawiająca grafik pracy na wybrane przez użytkownika dni.

 </br>

<p align="center">
  <img height="500" src="./readme-assets/presentation.gif" alt="Prezentacja głównego widoku aplikacji" />
</p>

## Instalacja

Progresywna aplikacja webowa (PWA) pozwala na przeprowadzenie instalacji z poziomu przeglądarki (zalecany Google Chrome).
|Instrukcja |Załącznik |
| ------------------------------------------------------ | :----------------------------------------: |
| 1. Odwiedź stronę https://grafik.brzozko.pl/ | |
| 2. Na pasku adresu wciśnij przycisk z symbolem "plusa" | ![Presentation](readme-assets/install.png) |
| 3. Wybierz "Zainstaluj" |

## Grafik

Przedstawiany grafik pracy składa się z następującego schematu:

| Lp. | Zmiana (Oznaczenie w aplikacji) | Uwagi                                       |
| --- | ------------------------------- | ------------------------------------------- |
| 1.  | Dzienna zmiana (na dzień)       |
| 2.  | Nocna zmiana (na noc)           |
| 3.  | Dzień wolny (po nocy)           |
| 4.  | Dzień wolny (wolne)             |
| 5.  | Dzienna zmiana (na dzień)       | :arrow_left: zmiana zaczyna się od początku |
| 6.  | ⋮                               |

Aplikacja domyślnie wyświetla grafik pracy na podstawie obecnej daty.

Użytkownik posiada możliwość sprawdzenia grafiku z maksymalnie rocznym wyprzedzeniem. Historia grafiku wynosi także 1 rok od obecnej daty.

## Generowanie danych

Generowanie nowych danych odbywa się za pomocą [Arkuszy Google](https://www.google.pl/intl/pl/sheets/about/). Następnie dane przesyłane są do [Firebase Realtime Database](https://firebase.google.com/docs/database/).
|![Presentation](readme-assets/sheetsDB.png)|
|:---:|
|_Wycinek bazy danych w Arkuszach Google_|

</br>

## Aktualizacja danych

Aktualizacja danych, znajdujących się w bazie danych czasu rzeczywistego Firebase, danymi wygenerowanymi w Arkuszach Google, odbywa się z wykorzystaniem [Firebase Realtime Database REST API](https://firebase.google.com/docs/database/rest/start).

### Przygotowanie danych do wysłania (Google Apps Script)

```

function formatSprDataBeforeSending() {
  const ss = SpreadsheetApp.getActiveSheet();
  const formattedDataObject = {};

  for (
    let i = SPREADSHEET_CONSTANTS.DATA_ROW_START;
    i <= SPREADSHEET_CONSTANTS.DATA_ROW_END;
    i++
  ) {
    const date = ss
      .getRange(i, SPREADSHEET_CONSTANTS.DATE_COL)
      .getDisplayValue();
    const work = ss
      .getRange(i, SPREADSHEET_CONSTANTS.WORK_COL)
      .getDisplayValue();

    formattedDataObject[date] = work;
  }

  sendDataToFirebaseDB(formattedDataObject);
}

```

### Wysłanie danych do bazy Firebase (Google Apps Script)

```
function sendDataToFirebaseDB(payload) {
  const url = FIREBASE_UTILS.DB_URL + FIREBASE_UTILS.DB_SECRET_KEY;
  const options = {
    method: "put",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };

  try {
    UrlFetchApp.fetch(url, options);
  } catch (e) {
    Utilities.sleep(10000);
    sendDataToFirebaseDB(payload);
  }
}

```

## Meta

Łukasz Brzózko – lukasz@brzozko.pl

Rozpowszechnianie na licencji MIT. Aby uzyskać więcej informacji, sprawdź warunki licencji.

[https://github.com/lukasz-brzozko](https://github.com/lukasz-brzozko)
