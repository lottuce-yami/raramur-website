<script setup>
import ServerHistory from "@/components/ServerHistory.vue";
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
</script>

<template>
  <div>
    <h1>История Рарамура</h1>
    <p class="contribute">
      Вы можете помочь с наполнением этой страницы! Присылайте свои истории, скриншоты (или хотя бы фотографии
      монитора...), догадки, сообщения или посты с упоминанием Рарамура и всё остальное, что может оказаться полезным в
      составлении целостной истории сервера - <a href="https://t.me/lottuce_yami">@lottuce_yami</a>. Если же вы из числа
      HTML-программистов, не стесняйтесь открывать пул-реквесты на GitHub - <a
      href="https://github.com/lottuce-yami/raramur-website">lottuce-yami/raramur-website</a>.
    </p>
    <ServerHistory name="Raramur Original" version="1.14.3" timespan="01.07.19 - 21.11.19">
      <section class="chapter">
        <p class="story">
          Сервер, на котором впервые прозвучало название "Рарамур". На открытии это был очередной безымянный сервер для
          подписчиков, но спустя уже пару дней в группе ВКонтакте появился пост с объявлением конкурса на название
          сервера.
        </p>
        <VueperSlides class="images" :slide-ratio="724/657">
          <VueperSlide image="/images/history/original/1_1.webp" key="1"/>
        </VueperSlides>
      </section>
      <section class="chapter">
        <p class="story">
          По результатам голосования победил вариант "FiftyFive", но настырность и убежденность в гениальности своего
          названия другого участника конкурса привели к решению провести опрос только среди тех, кто действительно
          играет на сервере, а не всех участников группы. Таким образом получилась смешная ситуация - в опросе выиграл
          один вариант названия, а сервер уже несколько лет существует под совершенно другим.
        </p>
        <VueperSlides class="images" :slide-ratio="5/5.7" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 2" :image="`/images/history/original/2_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
      <section class="chapter">
        <p class="story">
          Для многих этот сервер имеет статус культового: именно здесь был построен мост в никуда, огромное поле для
          первой неудавшейся попытки сбора миллиона пшеницы, лорный город в пустыне и множество других, не таких же
          глобальных, но запоминающихся объектов. К сожалению, сохранение сервера и большинство скриншотов найти не
          удалось.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 4" :image="`/images/history/original/3_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur Realms" version="1.14.x" timespan="26.11.19 - 09.12.19">
      <section class="chapter">
        <p class="story">
          Первый и единственный сервер в системе Realms. Карта была сгенерирована с опцией "большие биомы", а спавн
          находился в заснеженном биоме, так что сезон получился довольно-таки рождественским. Главным проектом сервера
          стал огромный снеговик Олаф, построенный Антошкой с помощью других игроков - в сборе ресурсов и постоянном
          сталкивании с вершины снеговика.
        </p>
        <VueperSlides class="images" :slide-ratio="1.2">
          <VueperSlide image="/images/history/realms/1_1.webp" key="1"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur v2.0" version="1.15.2" timespan="11.12.19 - 04.04.20" save="raramur_v2_1.15.2">
      <section class="chapter">
        <p class="story">
          Тот самый сервер, где наконец-то был собран миллион пшеницы! Посмотреть видео об этом непростом челлендже
          можно на <a href="https://youtu.be/P1FhuDGB9os" target="_blank">YouTube</a>. Помимо этого там были: мемориал
          Windows 7, Шкаф и, конечно же, пчёлки - всё-таки обновление 1.15. На нулевых координатах есть интересный
          экспонат - шалкер, которого Антошка доставил прямиком из Энда (что очень непросто, зная способности Антошки).
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 8" :image="`/images/history/v2.0/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur v2.5" version="1.16.1" timespan="23.06.20 - 21.08.20" save="raramur_v2.5_1.16.1">
      <section class="chapter">
        <p class="story">
          Непопулярный среди активных игроков сервер, из примечательного только проекты Антошки: Stride Racing и дом в
          аду. Если полетать по серверу, можно наткнуться на несколько довольно красивых баз, но большинство из них не
          выглядят достроенными.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 6" :image="`/images/history/v2.5/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory version="1.16.2" timespan="26.08.20 - 01.10.20">
      <section class="chapter">
        <p class="story">
          Об этом сервере известно только то, что добавление в вайтлист происходило по заявкам. Для сбора заявок был
          разработан сайт, который сохранился в памяти - как человеческой, так и компьютерной, - в отличие от каких-либо
          других воспоминаний о сервере.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16">
          <VueperSlide image="/images/history/1.16.2/1_1.webp" key="1"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur Reborn" version="1.16.5" timespan="11.01.21 - 03.07.21" save="raramur_reborn_1.16.5">
      <section class="chapter">
        <p class="story">
          Второй по культовости Рарамур. Практически все игроки объединились на одном проекте: городе, который скорее
          напоминал деревню. В городе были библиотека, банк, офис компании СКД, ресторан, супермаркет.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 9" :image="`/images/history/reborn/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
      <section class="chapter">
        <p class="story">
          Ярким событием стал праздник на площади с конкурсом чашек, мини-концертом и фейерверками. Видео с фейерверками
          можно посмотреть на <a href="https://youtu.be/xJyThi4TSxA" target="_blank">YouTube</a>.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16">
          <VueperSlide image="/images/history/reborn/2_1.webp" key="1"/>
        </VueperSlides>
      </section>
      <section class="chapter">
        <p class="story">
          Специально для этого сервера были разработаны датапак и ресурпак, которые добавляли в игру монеты и банкоматы.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide class="no-cover" v-for="i in 4" :image="`/images/history/reborn/3_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur Beta" version="b1.7.3" timespan="06.07.21 - 18.07.21" save="raramur_beta_b1.7.3">
      <section class="chapter">
        <p class="story">
          На время этого короткого сезона игроки вернулись к истокам - бета-версии Minecraft. А ведь до релиза 1.0 в
          игре даже не было дракона! Но никому и не нужна эта навязанная цель, ведь можно построить пиксель-арт Пикачу
          сразу на спавне, любоваться им и не задумываться о нехватке контента.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 2" :image="`/images/history/beta/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur v3.0" version="1.17.1" timespan="18.07.21 -  29.11.21" save="raramur_v3_1.17.1">
      <section class="chapter">
        <p class="story">
          Сервер без отображения координат и, на первое время, без Энда. Интересный факт: хотя ориентироваться в
          пространстве стало сложнее, это не помешало игрокам разбрестись по всему миру. Возможно, попытка отдохнуть от
          совместного города в прошлом сезоне... На этом сервере были построены такие проекты как Raramurlend, адронный
          коллайдер (по плану внутри должна была крутиться жаба), уютный спавн с магазином и обустроенной набережной.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 7" :image="`/images/history/v3.0/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur Ascended" version="1.19.2" timespan="10.12.21 - 08.01.23"
                   save="raramur_ascended_1.19.2">
      <section class="chapter">
        <p class="story">
          Этот сервер вновь попытался объединить игроков: по плану, общим проектом должен был стать город в горе - в
          тему нового обновления. Частично проект можно считать выполненным, так как большинство игроков жили у высокой
          горы на спавне. Однако городом данную общину назвать трудно - это больше походило на выставку скульптур и
          арт-объектов.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 5" :image="`/images/history/ascended/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
      <section class="chapter">
        <p class="story">
          Но на этом сходства с "городским" сезоном не заканчиваются, ведь и в этом случае был проведён праздник -
          "Тайный Санта". В этом ивенте поучаствовали практически все игроки - всё благодаря Антошке, который активно
          продвигал его и привлекал как можно больше участников.
        </p>
        <VueperSlides class="images" :slide-ratio="10/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 4" :image="`/images/history/ascended/2_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur In a Jar" version="1.18.2" timespan="08.01.23 - 20.01.23"
                   save="raramur_in-a-jar_1.18.2">
      <section class="chapter">
        <p class="story">
          Первый сервер на предварительно созданной карте. Хотя это всё ещё был ванильный сервер, Рарамур впервые ощутил
          на себе настоящий эксперимент. Всё-таки игра в полноценном мире, хоть и с необычными правилами или даже
          датапаками, сильно отличается от игры в ограниченном пространстве - в данном случае, в банках.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 2" :image="`/images/history/in-a-jar/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur: All of Fabric 6" version="1.19.2" timespan="13.02.23 - 26.04.23"
                   save="raramur_all-of-fabric-6_1.19.2">
      <section class="chapter">
        <p class="story">
          Первый модный (с модами) сервер в истории Рарамура. Не обрёл большой популярности среди игроков, но показал
          новые перспективы для сервера. Теперь сезоны могут не только поощрять креатив игроков в ванильной игре, но и
          ставить перед собой цель пройти какой-нибудь модпак.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 5" :image="`/images/history/all-of-fabric-6/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
    <ServerHistory name="Raramur Raft" version="1.17.1" timespan="26.08.23 - 31.08.23" save="raramur_raft_1.17.1">
      <section class="chapter">
        <p class="story">
          По факту однодневный сервер на карте в стиле игры Raft, "комната ожидания" следующего сезона.
        </p>
        <VueperSlides class="images" :slide-ratio="9/16" autoplay duration="10000" :touchable="false">
          <VueperSlide v-for="i in 2" :image="`/images/history/raft/1_${i}.webp`" :key="i"/>
        </VueperSlides>
      </section>
    </ServerHistory>
  </div>
</template>

<style scoped>
div {
  background-color: var(--color-main);
  padding: 0 2rem;
}

h1 {
  font-family: var(--font-heading);
  line-height: 1.5;
}

.contribute {
  margin-bottom: 1.5rem;
  width: 75%;
  text-align: justify;
  font-style: italic;
}
</style>