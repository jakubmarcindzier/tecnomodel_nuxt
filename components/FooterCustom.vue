<template>
  <footer id="footer" class="bg-dark text-white p-4">
    <b-container fluid>
      <b-row class="pb-4">
        <b-col class="text-center small">
          <p class="text-muted my-0">
            *: Tutti i prezzi indicati sono IVA inclusa.
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          class="pt-4 pb-3 border-top small"
          style="border-color: #6c757d !important"
        >
          <b-container fluid>
            <b-row class="text-left">
              <b-col>
                <h6>Tecnomodel</h6>
                <ul class="list-unstyled">
                  <li>
                    <b-link to="/f/promo">Offerte</b-link>
                  </li>
                  <li>
                    <b-link to="/f/preorder">Preordine</b-link>
                  </li>
                  <li>
                    <b-link to="/f/news">Nuovi arrivi</b-link>
                  </li>
                  <li>
                    <b-link to="/f/used">Usato</b-link>
                  </li>
                  <li>
                    <b-link to="/f/discount">Sconti a tempo</b-link>
                  </li>
                  <li>
                    <b-link to="/brand">Produttori</b-link>
                  </li>
                  <li>
                    <b-link href="https://catalogs.tecnomodel-treni.it/"
                      >Cataloghi e Brochure</b-link
                    >
                  </li>
                </ul>
              </b-col>
              <b-col>
                <h6>Servizio clienti</h6>
                <ul class="list-unstyled">
                  <li>
                    <b-link :href="$config.supportWebsite + 'it'">Aiuto</b-link>
                  </li>
                  <li>
                    <b-link to="/contacts">Contatti</b-link>
                  </li>
                  <li>
                    <b-link v-b-modal.withdrawal>Recesso</b-link>
                  </li>
                  <li>
                    <b-link v-b-modal.privacy>Privacy & Cookie Policy</b-link>
                  </li>
                  <li>
                    <b-link
                      target="_blank"
                      :href="$config.oldBaseUrl + 'job_with_us.php'"
                      >Lavora con noi</b-link
                    >
                  </li>
                </ul>
              </b-col>
              <b-col>
                <h6>Pagamenti sicuri</h6>
                <credit-card-icon name="mastercard" class="m-1" />
                <credit-card-icon name="visa" class="m-1" />
                <credit-card-icon name="amex" class="m-1" />
                <credit-card-icon name="diners" class="m-1" />
                <credit-card-icon name="paypal" class="m-1" />
              </b-col>
              <b-col>
                <h6>Seguici su</h6>
                <b-link href="https://it-it.facebook.com/tecnomodeltreni.it/"
                  ><font-awesome-icon
                    :icon="['fab', 'facebook-square']"
                    size="2x"
                    class="mr-2"
                /></b-link>
                <b-link href="https://www.youtube.com/user/tecnomodeltreni"
                  ><font-awesome-icon
                    :icon="['fab', 'youtube-square']"
                    size="2x"
                /></b-link>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          class="py-4 border-top text-center small"
          style="border-color: #6c757d !important"
        >
          <p class="text-muted my-0">
            Copyright © 2004-{{ year }}. Tutti i diritti riservati. È vietata la
            riproduzione anche parziale. {{ $config.companyName }} -
            {{ $config.companyAddress }} - {{ $config.companyZipcode }}
            {{ $config.companyTown }} {{ $config.companyCountry }} - P.IVA:
            {{ $config.companyTaxCode }}
          </p>
        </b-col>
      </b-row>
      <b-modal
        id="withdrawal"
        ref="withdrawal"
        scrollable
        title="Diritto di recesso"
        size="xl"
        hide-footer
      >
        <div>
          <p>
            <strong
              >Ai sensi di legge D'Lgs 206/2005, il Cliente può avvalersi del
              diritto di recesso senza alcuna penalità e senza specificarne il
              motivo, entro il termine di 14 giorni dalla ricezione della
              merce.</strong
            >
          </p>
          <p>
            Per esercitare tale diritto il Cliente dovrà inviare una
            comunicazione scritta mediante lettera raccomandata con avviso di
            ricevimento a:
            <strong
              >Tecnomodel Srl, Via Pian di Rota 25/1, 57121 - Livorno
              (LI).</strong
            >
          </p>
          <p>
            La comunicazione può essere inviata anche mediante posta elettronica
            e fax, a condizione che sia confermata mediante lettera raccomandata
            con avviso di ricevimento entro le 48 ore successive.
          </p>
          <p>
            <strong>
              Il Cliente è tenuto a restituire gli articoli entro 14 giorni
              dalla data in cui ha comunicato la sua decisione di recedere dal
              contratto.
            </strong>
          </p>
          <p>
            <strong>
              Gli articoli devono essere restituiti nella confezione originale,
              integra e completa in ogni parte (imballo, aggiuntivi, istruzioni,
              lista dei ricambi, etc.).
            </strong>
          </p>
          <p>
            <strong>
              Per evitare danni alla confezione originale durante il trasporto,
              raccomandiamo di utilizzare il nostro imballaggio o comunque di
              inserirla in una seconda scatola.
            </strong>
          </p>
          <p>
            Le spese per la riconsegna sono a carico del Cliente e la spedizione
            è sotto la sua completa responsabilità fino al ricevimento nel
            nostro magazzino. Tecnomodel non risponde in nessun modo per danni,
            furto o smarrimento di beni restituiti tramite spedizioni non
            assicurate.
            <strong
              >Se alla ricezione il pacco risultasse danneggiato, Tecnomodel
              avrà facoltà di respingerlo.</strong
            >
          </p>
          <p>
            Fatte salve eventuali spese di ripristino per danni accertati
            all’imballo originale,
            <strong
              >Tecnomodel provvederà a rimborsare l’intero importo pagato,
              utilizzando lo stesso mezzo di pagamento usato dal Cliente</strong
            >: tramite storno su carta di credito o account PayPal nel caso in
            cui siano state utilizzate queste modalità di pagamento, oppure
            tramite bonifico su conto corrente. In quest’ultimo caso, sarà cura
            del Cliente fornire tempestivamente le coordinate bancarie su cui
            ottenere il rimborso (Cod. ABI – CAB- Conto Corrente
            dell’intestatario della fattura).
          </p>
          <p class="lead mt-4">Eccezioni al diritto di recesso</p>
          <hr class="my-4" />
          <p>
            Il diritto di recesso decade totalmente in mancanza della condizione
            essenziale di integrità del bene (confezione e/o il suo contenuto),
            nei casi in cui Tecnomodel accerti:
          </p>
          <ul>
            <li class="text-dark">
              utilizzo anche parziale del bene e di eventuali materiali di
              consumo;
            </li>
            <li class="text-dark">
              il danneggiamento o la mancanza della confezione esterna e/o
              dell’imballo interno originale;
            </li>
            <li class="text-dark">
              il danneggiamento del prodotto per cause diverse dal suo
              trasporto;
            </li>
            <li class="text-dark">l’assenza di particolari aggiuntivi.</li>
          </ul>
          <p></p>
          <p>
            <strong>
              Nei casi sopra indicati, Tecnomodel provvederà a restituire al
              Cliente il bene acquistato, addebitando le spese di spedizione.
            </strong>
          </p>
          <p>Il diritto di recesso è escluso relativamente a:</p>
          <ul>
            <li class="text-dark">clienti che acquistano con Partita IVA;</li>
            <li class="text-dark">
              a tutti gli articoli sigillati una volta che sono stati aperti;
            </li>
            <li class="text-dark">
              ai prodotti digitali o informatici come decoder o software
              sigillati che sono stati aperti dopo la consegna;
            </li>
            <li class="text-dark">
              beni confezionati su misura o chiaramente personalizzati per il
              Cliente (ad es. installazione decoder, invecchiamento/sporcatura,
              etc.);
            </li>
            <li class="text-dark">
              ai contenitori di vernici; a DVD, libri, giornali, periodici,
              riviste o editoria di ogni genere;
            </li>
            <li class="text-dark">utensili di precisione;</li>
            <li class="text-dark">prenotazioni.</li>
          </ul>
          <p></p>
        </div>
      </b-modal>
      <b-modal
        id="privacy"
        ref="privacy"
        scrollable
        title="Privacy Policy"
        size="xl"
        hide-footer
      >
        <privacy-policy-text />
      </b-modal>
    </b-container>
  </footer>
</template>

<script>
export default {
  name: 'FooterCustom',
  data() {
    return {
      year: new Date().getFullYear(),
      env: process.env,
    }
  },
  mounted() {
    if (this.$route.hash === '#withdrawal' || this.$route.hash === '#privacy')
      this.$refs[this.$route.hash.substring(1)].show()
  },
}
</script>

<style scoped>
a {
  color: lightgrey;
}

a:hover {
  text-decoration: none !important;
  color: white;
}
</style>
