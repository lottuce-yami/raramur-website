<script setup>
import { ref } from 'vue';
import ServerHistory from "@/components/ServerHistory.vue";
import HistoryGallery from "@/components/HistoryGallery.vue";
import ImageLightbox from "@/components/ImageLightbox.vue";

/** @type {import('vue').Ref<{ images: string[], index: number } | null>} */
const lightbox = ref(null);

/**
 * @param {{ url: string, images: string[], index: number }} payload
 */
function openImage(payload) {
  lightbox.value = {
    images: payload.images,
    index: payload.index
  };
}

function closeImage() {
  lightbox.value = null;
}

/**
 * @param {number} index
 */
function setLightboxIndex(index) {
  if (!lightbox.value) {
    return;
  }
  lightbox.value = {
    images: lightbox.value.images,
    index
  };
}
</script>

<template>
  <div class="content">
    <header class="page-header">
      <h1 class="page-heading">История Рарамура</h1>
      <div class="contribute">
        <p>
          Вы можете помочь с наполнением этой страницы! Присылайте свои истории, скриншоты (или хотя бы фотографии
          монитора…), догадки, сообщения или посты с упоминанием Рарамура и всё остальное, что может оказаться полезным в
          составлении целостной истории сервера — <a href="https://t.me/lottuce_yami" target="_blank" rel="noopener">@lottuce_yami</a>. Если же вы из числа
          HTML-программистов, не стесняйтесь открывать пул-реквесты на GitHub — <a
          href="https://github.com/lottuce-yami/raramur-website" target="_blank" rel="noopener">lottuce-yami/raramur-website</a>.
        </p>
      </div>
    </header>

    <div class="timeline-wrapper">
      <div class="timeline-spine" aria-hidden="true"></div>

      <!-- 2019 ERA -->
      <div class="year-marker">
        <span class="year-badge">2019</span>
      </div>

      <ServerHistory
        name="Raramur Original"
        version="1.14.3"
        timespan="01.07.19 – 21.11.19"
        seed="-415575943898109"
      >
        <section class="chapter">
          <p class="story">
            Сервер, на котором впервые прозвучало название «Рарамур». На открытии это был очередной безымянный сервер для
            подписчиков, но спустя уже пару дней в группе ВКонтакте появился пост с объявлением конкурса на название
            сервера.
          </p>
          <HistoryGallery folder="original" :chapter="1" :count="1" @open="openImage" />
        </section>
        <section class="chapter">
          <p class="story">
            По результатам голосования победил вариант «FiftyFive», но настырность и убежденность в гениальности своего
            названия другого участника конкурса привели к решению провести опрос только среди тех, кто действительно
            играет на сервере, а не всех участников группы. Таким образом получилась смешная ситуация — в опросе выиграл
            один вариант названия, а сервер уже несколько лет существует под совершенно другим.
          </p>
          <HistoryGallery folder="original" :chapter="2" :count="2" @open="openImage" />
        </section>
        <section class="chapter">
          <p class="story">
            Для многих этот сервер имеет статус культового: именно здесь был построен мост в никуда, огромное поле для
            первой неудавшейся попытки сбора миллиона пшеницы, лорный город в пустыне и множество других, не таких же
            глобальных, но запоминающихся объектов. К сожалению, сохранение сервера и большинство скриншотов найти не
            удалось.
          </p>
          <HistoryGallery folder="original" :chapter="3" :count="4" @open="openImage" />
        </section>
      </ServerHistory>

      <ServerHistory
        name="Raramur Realms"
        version="1.14.x"
        timespan="26.11.19 – 09.12.19"
      >
        <section class="chapter">
          <p class="story">
            Первый и единственный сервер в системе Realms. Карта была сгенерирована с опцией “большие биомы”, а спавн
            находился в заснеженном биоме, так что сезон получился довольно-таки рождественским. Главным проектом сервера
            стал огромный снеговик Олаф, построенный Антошкой с помощью других игроков — в сборе ресурсов и постоянном
            сталкивании с вершины снеговика.
          </p>
          <HistoryGallery folder="realms" :chapter="1" :count="2" @open="openImage" />
        </section>
      </ServerHistory>

      <ServerHistory
        name="Raramur v2.0"
        version="1.15.2"
        timespan="11.12.19 – 04.04.20"
        save="https://drive.google.com/file/d/1ywkVHE7sMr_Y_bnTCLZG0BEfhda8yo11/view"
      >
        <section class="chapter">
          <p class="story">
            Тот самый сервер, где наконец-то был собран миллион пшеницы! Посмотреть видео об этом непростом челлендже
            можно на <a href="https://youtu.be/P1FhuDGB9os" target="_blank" rel="noopener">YouTube</a>. Помимо этого там были: мемориал
            Windows 7, Шкаф и, конечно же, пчёлки — всё-таки обновление 1.15. На нулевых координатах есть интересный
            экспонат — шалкер, которого Антошка доставил прямиком из Энда (что очень непросто, зная способности Антошки).
          </p>
          <HistoryGallery folder="v2.0" :chapter="1" :count="8" @open="openImage" />
        </section>
      </ServerHistory>

      <!-- 2020 ERA -->
      <div class="year-marker">
        <span class="year-badge">2020</span>
      </div>

      <ServerHistory
        name="Raramur v2.5"
        version="1.16.1"
        timespan="23.06.20 – 21.08.20"
        save="https://drive.google.com/file/d/1Lgnfw__pxpTiIshnTnNbyP8FeMjefMm4/view"
      >
        <section class="chapter">
          <p class="story">
            Непопулярный среди активных игроков сервер, из примечательного только проекты Антошки: Stride Racing и дом в
            аду. Если полетать по серверу, можно наткнуться на несколько довольно красивых баз, но большинство из них не
            выглядят достроенными.
          </p>
          <HistoryGallery folder="v2.5" :chapter="1" :count="6" @open="openImage" />
        </section>
      </ServerHistory>

      <ServerHistory
        version="1.16.2"
        timespan="26.08.20 – 01.10.20"
      >
        <section class="chapter">
          <p class="story">
            Об этом сервере известно только то, что добавление в вайтлист происходило по заявкам. Для сбора заявок был
            разработан сайт, который сохранился в памяти — как человеческой, так и компьютерной, — в отличие от каких-либо
            других воспоминаний о сервере.
          </p>
          <HistoryGallery folder="1.16.2" :chapter="1" :count="1" @open="openImage" />
        </section>
      </ServerHistory>

      <!-- 2021 ERA -->
      <div class="year-marker">
        <span class="year-badge">2021</span>
      </div>

      <ServerHistory
        name="Raramur Reborn"
        version="1.16.5"
        timespan="11.01.21 – 03.07.21"
        save="https://drive.google.com/file/d/1Cw435wKXqRNnU2Il9qltDk9g9ZutBaxS/view"
      >
        <section class="chapter">
          <p class="story">
            Второй по культовости Рарамур. Практически все игроки объединились на одном проекте: городе, который скорее
            напоминал деревню. В городе были библиотека, банк, офис компании СКД, ресторан, супермаркет.
          </p>
          <HistoryGallery folder="reborn" :chapter="1" :count="9" @open="openImage" />
        </section>
        <section class="chapter">
          <p class="story">
            Ярким событием стал праздник на площади с конкурсом чашек, мини-концертом и фейерверками. Видео с фейерверками
            можно посмотреть на <a href="https://youtu.be/xJyThi4TSxA" target="_blank" rel="noopener">YouTube</a>.
          </p>
          <HistoryGallery folder="reborn" :chapter="2" :count="1" @open="openImage" />
        </section>
        <section class="chapter">
          <p class="story">
            Специально для этого сервера были разработаны датапак и ресурпак, которые добавляли в игру монеты и банкоматы.
          </p>
          <HistoryGallery folder="reborn" :chapter="3" :count="4" @open="openImage" />
        </section>
      </ServerHistory>

      <ServerHistory
        name="Raramur Beta"
        version="b1.7.3"
        timespan="06.07.21 – 18.07.21"
        save="https://drive.google.com/file/d/1BvEUPwNrcpljBUFGgB8O2SU7cOhrSZYT/view"
      >
        <section class="chapter">
          <p class="story">
            На время этого короткого сезона игроки вернулись к истокам — бета-версии Minecraft. А ведь до релиза 1.0 в
            игре даже не было дракона! Но никому и не нужна эта навязанная цель, ведь можно построить пиксель-арт Пикачу
            сразу на спавне, любоваться им и не задумываться о нехватке контента.
          </p>
          <HistoryGallery folder="beta" :chapter="1" :count="2" @open="openImage" />
        </section>
      </ServerHistory>

      <ServerHistory
        name="Raramur v3.0"
        version="1.17.1"
        timespan="18.07.21 –  29.11.21"
        save="https://drive.google.com/file/d/1OrEjpVOrjZkt6i3FCqJOQHTP1pBJu1FO/view"
      >
        <section class="chapter">
          <p class="story">
            Сервер без отображения координат и, на первое время, без Энда. Интересный факт: хотя ориентироваться в
            пространстве стало сложнее, это не помешало игрокам разбрестись по всему миру. Возможно, попытка отдохнуть от
            совместного города в прошлом сезоне… На этом сервере были построены такие проекты как Raramurlend, адронный
            коллайдер (по плану внутри должна была крутиться жаба), уютный спавн с магазином и обустроенной набережной.
          </p>
          <HistoryGallery folder="v3.0" :chapter="1" :count="7" @open="openImage" />
        </section>
      </ServerHistory>

      <ServerHistory
        name="Raramur Ascended"
        version="1.19.2"
        timespan="10.12.21 – 08.01.23"
        save="https://drive.google.com/file/d/1tcYn-V9r62yBbsb7x-kcwichvXr-7-8G/view"
      >
        <section class="chapter">
          <p class="story">
            Этот сервер вновь попытался объединить игроков: по плану, общим проектом должен был стать город в горе — в
            тему нового обновления. Частично проект можно считать выполненным, так как большинство игроков жили у высокой
            горы на спавне. Однако городом данную общину назвать трудно — это больше походило на выставку скульптур и
            арт-объектов.
          </p>
          <HistoryGallery folder="ascended" :chapter="1" :count="5" @open="openImage" />
        </section>
        <section class="chapter">
          <p class="story">
            Но на этом сходства с “городским” сезоном не заканчиваются, ведь и в этом случае был проведён праздник —
            “Тайный Санта”. В этом ивенте поучаствовали практически все игроки — всё благодаря Антошке, который активно
            продвигал его и привлекал как можно больше участников.
          </p>
          <HistoryGallery folder="ascended" :chapter="2" :count="4" @open="openImage" />
        </section>
      </ServerHistory>

      <!-- 2023 ERA -->
      <div class="year-marker">
        <span class="year-badge">2023</span>
      </div>

      <ServerHistory
        name="Raramur In a Jar"
        version="1.18.2"
        timespan="08.01.23 – 20.01.23"
        save="https://drive.google.com/file/d/1sGlGqS7y5WUwLqSmsOUNnHVFjjlnMQ9_/view"
      >
        <section class="chapter">
          <p class="story">
            Первый сервер на предварительно созданной карте. Хотя это всё ещё был ванильный сервер, Рарамур впервые ощутил
            на себе настоящий эксперимент. Всё-таки игра в полноценном мире, хоть и с необычными правилами или даже
            датапаками, сильно отличается от игры в ограниченном пространстве — в данном случае, в банках.
          </p>
          <HistoryGallery folder="in-a-jar" :chapter="1" :count="2" @open="openImage" />
        </section>
      </ServerHistory>

      <ServerHistory
        name="Raramur: All of Fabric 6"
        version="1.19.2"
        timespan="13.02.23 – 26.04.23"
        save="https://drive.google.com/file/d/1SiUW87frO1eVw-P6TyOOOi8UBqHKCMU7/view"
      >
        <section class="chapter">
          <p class="story">
            Первый модный (с модами) сервер в истории Рарамура. Не обрёл большой популярности среди игроков, но показал
            новые перспективы для сервера. Теперь сезоны могут не только поощрять креатив игроков в ванильной игре, но и
            ставить перед собой цель пройти какой-нибудь модпак.
          </p>
          <HistoryGallery folder="all-of-fabric-6" :chapter="1" :count="5" @open="openImage" />
        </section>
      </ServerHistory>

      <ServerHistory
        name="Raramur Raft"
        version="1.17.1"
        timespan="26.08.23 – 31.08.23"
        save="https://drive.google.com/file/d/1IqDLNbGg2EDsFnWkNrER0vOZHWylvsuI/view"
      >
        <section class="chapter">
          <p class="story">
            По факту однодневный сервер на карте в стиле игры Raft, “комната ожидания” следующего сезона.
          </p>
          <HistoryGallery folder="raft" :chapter="1" :count="2" @open="openImage" />
        </section>
      </ServerHistory>
    </div>

    <ImageLightbox
      v-if="lightbox"
      :images="lightbox.images"
      :index="lightbox.index"
      @update:index="setLightboxIndex"
      @close="closeImage"
    />
  </div>
</template>

<style scoped>
.content {
  background-color: transparent;
  max-width: 1180px;
  margin: 0 auto;
  padding: 2.75rem 2rem 6rem;
}

.page-header {
  margin-bottom: 2.75rem;
}

.page-eyebrow {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.65rem;
}

.page-heading {
  font-family: var(--font-heading);
  font-size: 2.75rem;
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 1.35rem;
  letter-spacing: -0.02em;
  background: linear-gradient(0deg, var(--color-accent), var(--color-accent-alt));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.contribute {
  padding: 1.25rem 1.75rem;
  background: rgba(255, 255, 255, 0.78);
  border-left: 4px solid var(--color-accent);
  border-radius: 0 14px 14px 0;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.035);
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--black-soft);
  max-width: 980px;
  margin-bottom: 0;
}

.contribute a {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--color-accent-light);
  transition: color 0.2s ease, border-bottom-color 0.2s ease;
}

.contribute a:hover {
  color: var(--color-accent-alt);
  border-bottom-color: var(--color-accent);
}

.timeline-wrapper {
  --timeline-gutter: 48px;
  --timeline-node-size: 24px;
  --timeline-spine-width: 3px;

  position: relative;
}

.timeline-spine {
  position: absolute;
  left: calc((var(--timeline-gutter) - var(--timeline-spine-width)) / 2);
  top: 15px;
  bottom: 25px;
  width: var(--timeline-spine-width);
  background: linear-gradient(
    to bottom,
    var(--color-accent) 0%,
    var(--color-accent-light) 45%,
    rgba(255, 115, 143, 0.18) 100%
  );
  border-radius: 999px;
}

.year-marker {
  position: relative;
  margin: 3.25rem 0 2.25rem;
  display: flex;
  align-items: center;
}

.year-marker:first-of-type {
  margin-top: 0.5rem;
}

.year-badge {
  position: relative;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-alt) 100%);
  color: #ffffff;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
  padding: 0.35rem 1.25rem;
  border-radius: 9999px;
  box-shadow: 0 4px 14px rgba(255, 115, 143, 0.4);
  display: inline-flex;
  align-items: center;
  z-index: 3;
}

@media (max-width: 768px) {
  .content {
    padding: 1.75rem 1.15rem 4rem;
  }

  .page-heading {
    font-size: 2.15rem;
  }

  .contribute {
    padding: 1rem 1.15rem;
    font-size: 0.98rem;
  }

  .timeline-wrapper {
    --timeline-gutter: 32px;
    --timeline-node-size: 20px;
  }

  .year-badge {
    font-size: 0.95rem;
    padding: 0.3rem 1rem;
  }
}

@media (max-width: 600px) {
  .content {
    padding: 1.35rem 0.6rem 3.5rem;
  }

  .page-heading {
    font-size: 1.75rem;
  }

  .contribute {
    padding: 0.9rem 1rem;
    font-size: 0.92rem;
  }

  .timeline-wrapper {
    --timeline-gutter: 0px;
  }

  .timeline-spine {
    display: none;
  }

  .year-marker {
    gap: 0.75rem;
    margin: 2.5rem 0 1.75rem;
  }

  .year-marker::before,
  .year-marker::after {
    content: "";
    flex: 1;
    height: 2px;
    background: rgba(255, 115, 143, 0.25);
    border-radius: 999px;
  }

  .year-badge {
    font-size: 0.85rem;
    padding: 0.25rem 0.85rem;
  }
}
</style>
