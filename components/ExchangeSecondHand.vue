<template>
  <b-container fluid>
    <b-row>
      <b-col sm="6" lg="3">
        <div
          class="border-0 rounded-0 h-100"
          style="background: #f7cd34; min-width: 200px"
        >
          <nuxt-img
            src="/home/second-hand/1.jpg"
            fit="contain"
            format="webp"
            quality="90"
            background="white"
            loading="lazy"
            class="card-img-top"
          />
          <div class="card-body text-darkgreen">
            <h4 class="card-title">
              Vuoi proporre una permuta o l'acquisto della tua collezione?
            </h4>
            <p class="card-text" style="color: #347571">
              Segui questi passaggi:
            </p>
          </div>
        </div>
      </b-col>
      <b-col sm="6" lg="3">
        <div
          class="border-0 rounded-0 h-100"
          style="background: #7ec0a4; min-width: 200px"
        >
          <nuxt-img
            src="/home/second-hand/2.jpg"
            fit="contain"
            format="webp"
            quality="90"
            background="white"
            loading="lazy"
            class="card-img-top"
          />
          <div class="card-body text-white">
            <h4 class="card-title">1</h4>
            <p class="card-text">
              Invia una lista degli articoli con delle foto, specifica lo stato
              di conservazione ed eventuali modifiche apportate.
            </p>
          </div>
        </div>
      </b-col>
      <b-col sm="6" lg="3">
        <div
          class="border-0 rounded-0 h-100"
          style="background: #2daf82; min-width: 200px"
        >
          <nuxt-img
            src="/home/second-hand/3.jpg"
            fit="contain"
            format="webp"
            quality="90"
            background="white"
            loading="lazy"
            class="card-img-top"
          />
          <div class="card-body text-white">
            <h4 class="card-title">2</h4>
            <p class="card-text">
              Ti comunicheremo la nostra valutazione e, se interessato alla
              nostra offerta, prenoteremo il ritiro degli articoli.
            </p>
          </div>
        </div>
      </b-col>
      <b-col sm="6" lg="3">
        <div
          class="border-0 rounded-0 h-100"
          style="background: #5ec57e; min-width: 200px"
        >
          <nuxt-img
            src="/home/second-hand/4.jpg"
            fit="contain"
            format="webp"
            quality="90"
            background="white"
            loading="lazy"
            class="card-img-top"
          />
          <div class="card-body text-white">
            <h4 class="card-title">3</h4>
            <p class="card-text">
              Infine riceverai un credito per acquistare altro materiale sul
              sito, oppure un pagamento.
            </p>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'ExchangeSecondHand',
}
</script>
