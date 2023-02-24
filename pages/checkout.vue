<template>
  <span>
    <client-only>
      <div :class="{ 'd-none': validCart }" class="text-center text-muted my-5">
        <b-spinner style="width: 6rem; height: 6rem" label="Text Centered">
        </b-spinner>
        <br />
        <strong class="mt-2">{{ $t('loading_checkout') }}</strong>
      </div>
      <section
        id="checkout"
        :class="{ 'd-none': !validCart }"
        class="flex-fill bg-light"
      >
        <b-container
          fluid
          class="px-4 pt-4"
          :class="{ 'd-none': checkoutSuccess === true }"
        >
          <b-row>
            <b-col lg="5" class="order-lg-last sticky-top" style="top: 10px">
              <b-card class="sticky-top" style="top: 20px">
                <b-card-text>
                  <div v-if="currentStep === 1">
                    <b-button
                      v-if="!billingAsShipping"
                      block
                      size="lg"
                      @click="forceSubmit(billingAddressFormComponent)"
                    >
                      Usa questo indirizzo di fatturazione
                    </b-button>
                    <b-button
                      v-else
                      block
                      size="lg"
                      @click="
                        forceSubmit(
                          billingAddressFormComponent,
                          shippingAddressFormComponent
                        )
                      "
                    >
                      Usa questo indirizzo
                    </b-button>
                    <p class="text-center m-0 mt-2">
                      <span v-if="!billingAsShipping"
                        ><small
                          >Passa alla fase di scelta indirizzo di
                          spedizione</small
                        ></span
                      >
                      <span v-else
                        ><small
                          >Passa alla fase di scelta del metodo di
                          pagamento</small
                        ></span
                      >
                    </p>
                    <div class="d-flex flex-row">
                      <h5 class="flex-fill font-weight-bold">Totale ordine</h5>
                      <h5 class="font-weight-bold">
                        <Price :amount="totalAmount"></Price>
                      </h5>
                    </div>
                  </div>
                  <div v-if="currentStep === 2">
                    <b-button
                      block
                      size="lg"
                      @click="forceSubmit(shippingAddressFormComponent)"
                      >Usa questo indirizzo di spedizione
                    </b-button>
                    <p class="text-center m-0 mt-2">
                      <small
                        >Passa alla fase di scelta del metodo di
                        pagamento</small
                      >
                    </p>
                    <div class="d-flex flex-row">
                      <h5 class="flex-fill font-weight-bold">Totale ordine</h5>
                      <h5 class="font-weight-bold">
                        <Price :amount="totalAmount"></Price>
                      </h5>
                    </div>
                  </div>
                  <div v-if="currentStep === 3">
                    <b-button block size="lg" @click="choosePaymentMethod()"
                      >Usa questo metodo di pagamento
                    </b-button>
                    <p class="text-center m-0 mt-2">
                      <small
                        >Passa alla fase di scelta del metodo di
                        spedizione</small
                      >
                    </p>
                    <div class="d-flex flex-row">
                      <h5 class="flex-fill font-weight-bold">Totale ordine</h5>
                      <h5 class="font-weight-bold">
                        <Price :amount="totalAmount"></Price>
                      </h5>
                    </div>
                  </div>
                  <div :class="{ 'd-none': !(currentStep === 4) }">
                    <b-button
                      :class="{
                        'd-none': !(defaultPaymentMethod === 'credit-card'),
                      }"
                      block
                      size="lg"
                      :disabled="processingPayment"
                      @click="payWithCreditCard"
                      >Paga con carta di credito
                      <b-spinner
                        v-if="processingPayment"
                        class="ml-2"
                        small
                      ></b-spinner>
                    </b-button>
                    <div
                      :class="{
                        'd-none': !(defaultPaymentMethod === 'paypal'),
                      }"
                      class="text-center"
                    >
                      <div id="pp-button"></div>
                      <b-button
                        :class="{
                          'd-none': chosenPPToken === null,
                        }"
                        block
                        size="lg"
                        :disabled="processingPayment"
                        @click="payWithPayPal"
                        >Paga con PayPal
                        <b-spinner
                          v-if="processingPayment"
                          class="ml-2"
                          small
                        ></b-spinner>
                      </b-button>
                    </div>
                    <div
                      :class="{
                        'd-none': !(
                          defaultPaymentMethod === 'sofort' ||
                          defaultPaymentMethod === 'mybank'
                        ),
                      }"
                      class="text-center"
                    >
                      <b-button
                        block
                        class="border-0"
                        size="lg"
                        :disabled="processingPayment"
                        @click="localPayment(defaultPaymentMethod)"
                        >Paga con {{ defaultPaymentMethod }}
                        <b-spinner
                          v-if="processingPayment"
                          class="ml-2"
                          small
                        ></b-spinner>
                      </b-button>
                    </div>
                    <b-button
                      :class="{
                        'd-none':
                          defaultPaymentMethod === 'credit-card' ||
                          defaultPaymentMethod === 'paypal' ||
                          defaultPaymentMethod === 'sofort' ||
                          defaultPaymentMethod === 'mybank',
                      }"
                      block
                      size="lg"
                      :disabled="processingPayment"
                      @click="payWithOther"
                      >Acquista Ora
                      <b-spinner
                        v-if="processingPayment"
                        class="ml-2"
                        small
                      ></b-spinner>
                    </b-button>
                    <p class="text-center mt-1 mb-0" style="font-size: 12px">
                      Confermando dichiari di aver preso visione delle
                      condizioni generali di vendita
                    </p>
                    <b-alert
                      class="text-center my-2"
                      variant="danger"
                      dismissible
                      fade
                      :show="error !== null"
                    >
                      {{ error }}
                    </b-alert>
                    <b-collapse id="collapse-total-detail" v-model="visible">
                      <b-form-textarea
                        id="sales-terms"
                        class="form-control my-2"
                        rows="5"
                        style="font-size: 12px"
                        readonly
                        no-resize
                        placeholder="Ai sensi di legge D'Lgs 206/2005, il Cliente può avvalersi del diritto di recesso senza alcuna penalità e senza specificarne il motivo, entro il termine di 14 giorni dalla ricezione della merce. Per esercitare tale diritto il Cliente dovrà inviare una comunicazione scritta mediante lettera raccomandata con avviso di ricevimento a: Tecnomodel Srl, Via Pian di Rota 25/1, 57121 - Livorno (LI). La comunicazione può essere inviata anche mediante posta elettronica e fax, a condizione che sia confermata mediante lettera raccomandata con avviso di ricevimento entro le 48 ore successive. Il Cliente è tenuto a restituire gli articoli entro 14 giorni dalla data in cui ha comunicato la sua decisione di recedere dal contratto. Gli articoli devono essere restituiti nella confezione originale, integra e completa in ogni parte (imballo, aggiuntivi, istruzioni, lista dei ricambi, etc.). Per evitare danni alla confezione originale durante il trasporto, raccomandiamo di utilizzare il nostro imballaggio o comunque di inserirla in una seconda scatola. Le spese per la riconsegna sono a carico del Cliente e la spedizione è sotto la sua completa responsabilità fino al ricevimento nel nostro magazzino. Tecnomodel non risponde in nessun modo per danni, furto o smarrimento di beni restituiti tramite spedizioni non assicurate. Se alla ricezione il pacco risultasse danneggiato, Tecnomodel avrà facoltà di respingerlo. Fatte salve eventuali spese di ripristino per danni accertati all'imballo originale, Tecnomodel provvederà a rimborsare l'intero importo pagato, utilizzando lo stesso mezzo di pagamento usato dal Cliente: tramite storno su carta di credito o account PayPal nel caso in cui siano state utilizzate queste modalità di pagamento, oppure tramite bonifico su conto corrente. In quest'ultimo caso, sarà cura del Cliente fornire tempestivamente le coordinate bancarie su cui ottenere il rimborso (Cod. ABI - CAB - Conto Corrente dell'intestatario della fattura). Eccezioni al diritto di recesso. Il diritto di recesso decade totalmente in mancanza della condizione essenziale di integrità del bene (confezione e/o il suo contenuto), nei casi in cui Tecnomodel accerti: utilizzo anche parziale del bene e di eventuali materiali di consumo; il danneggiamento o la mancanza della confezione esterna e/o dell'imballo interno originale; il danneggiamento del prodotto per cause diverse dal suo trasporto; l'assenza di particolari aggiuntivi. Nei casi sopra indicati, Tecnomodel provvederà a restituire al Cliente il bene acquistato, addebitando le spese di spedizione. Il diritto di recesso è escluso relativamente a: clienti che acquistano con Partita IVA; a tutti gli articoli sigillati una volta che sono stati aperti; ai prodotti digitali o informatici come decoder o software sigillati che sono stati aperti dopo la consegna; beni confezionati su misura o chiaramente personalizzati per il Cliente (ad es. installazione decoder, invecchiamento/sporcatura, etc.); ai buoni regalo; ai contenitori di vernici; a DVD, libri, giornali, periodici, riviste o editoria di ogni genere; utensili di precisione; prenotazioni. Prenotazioni L'invio di una prenotazione consente di riservare la quantità, ma non fissa il prezzo in quanto i prezzi sono sempre soggetti a variazioni del produttore. L'invio di una prenotazione in alcuni prodotti può dare diritto a uno sconto extra. La conferma di prenotazione (il saldo) deve essere eseguito entro e non oltre 15 giorni dalla data di uscita dell'articolo; dopo tale termine verrà automaticamente annullata la prenotazione e non più garatita la disponibilità dell'articolo."
                      >
                      </b-form-textarea>
                      <hr />
                      <b-button
                        v-b-toggle="'collapse-coupon'"
                        class="p-0 main-color text-decoration-none"
                        variant="link"
                      >
                        <font-awesome-icon icon="chevron-down" />
                        Aggiungi un buono regalo o un codice promozionale
                      </b-button>
                      <b-collapse id="collapse-coupon" class="mt-2">
                        <b-form inline>
                          <b-form-input v-model="couponKey"></b-form-input>
                          <b-button
                            class="mt-2 mt-md-0 mt-lg-0 ml-0 ml-md-2 ml-lg-2"
                            @click="insertCoupon"
                            >Aggiungi
                          </b-button>
                        </b-form>
                        <div
                          v-if="
                            maxUsableCouponAmount &&
                            maxUsableCouponAmount < couponAmount
                          "
                          class="font-italic mt-1"
                        >
                          Per questo ordine puoi utilizzare fino a
                          <price bold :amount="maxUsableCouponAmount" />, la
                          rimanenza verrà aggiunta sul tuo account Tecnomodel
                        </div>
                        <b-alert
                          v-model="couponSuccessCountDown"
                          dismissible
                          fade
                          class="mt-2"
                          variant="success"
                          >{{ couponMsg }}
                        </b-alert>
                        <b-alert
                          v-model="couponErrorCountDown"
                          dismissible
                          fade
                          class="mt-2"
                          variant="danger"
                          >{{ couponError }}
                        </b-alert>
                      </b-collapse>
                      <hr />
                      <template v-if="balanceAmount">
                        <b-button
                          v-b-toggle="'collapse-balance'"
                          class="p-0 main-color text-decoration-none"
                          variant="link"
                        >
                          <font-awesome-icon icon="chevron-down" />
                          Scala il tuo saldo disponibile
                        </b-button>
                        <b-collapse id="collapse-balance" class="mt-2">
                          <b-form-checkbox
                            v-model="useBalance"
                            @change="toggleBalance"
                          >
                            Usa i tuoi <price bold :amount="balanceAmount" /> di
                            saldo disponibile
                            <b-alert
                              dismissible
                              fade
                              class="mt-2"
                              variant="danger"
                              :show="maxUsableBalanceAmount === 0"
                            >
                              Importo insufficiente per detrarre il suo saldo
                            </b-alert>
                            <div
                              v-if="
                                maxUsableBalanceAmount > 0 &&
                                maxUsableBalanceAmount < balanceAmount
                              "
                              class="font-italic"
                            >
                              Per questo ordine puoi detrarre
                              <price bold :amount="maxUsableBalanceAmount" />
                            </div>
                          </b-form-checkbox>
                        </b-collapse>
                        <hr />
                      </template>
                      <div class="d-flex flex-row">
                        <span class="flex-fill"> Subtotale ordine </span>
                        <Price :amount="subTotalAmount"></Price>
                      </div>
                      <div class="d-flex flex-row">
                        <span class="flex-fill"> Costi di spedizione </span>
                        <Price :amount="shipmentTotalAmount"></Price>
                      </div>
                      <div
                        v-if="maxUsableBalanceAmount"
                        class="d-flex flex-row"
                      >
                        <span class="flex-fill text-success">
                          Saldo disponibile
                        </span>
                        <span class="text-success">
                          <Price :amount="0 - maxUsableBalanceAmount"></Price>
                        </span>
                      </div>
                      <div v-if="maxUsableCouponAmount" class="d-flex flex-row">
                        <b-form inline class="flex-fill text-success">
                          Coupon {{ usedCouponKey }}
                          <b-button
                            variant="link"
                            class="p-0 main-color text-decoration-none"
                            @click="removeCoupon"
                            >[Rimuovi]</b-button
                          >
                        </b-form>
                        <span class="text-success">
                          -<Price :amount="maxUsableCouponAmount"></Price>
                        </span>
                      </div>
                      <hr />
                    </b-collapse>
                    <div class="d-flex flex-row">
                      <h5 class="flex-fill font-weight-bold">Totale ordine</h5>
                      <h5 class="font-weight-bold">
                        <Price :amount="totalAmount"></Price>
                      </h5>
                    </div>
                  </div>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col lg="7">
              <div id="billingAddressBlock">
                <h5>{{ $t('billing_address') }}</h5>
                <b-card>
                  <CheckoutAddressManager
                    title="Indirizzo di fatturazione"
                    :type="billingAddressType"
                    :step="1"
                    :country-list="countryList"
                    :address-list="billingAddressList"
                    :default-address="defaultBillingAddress"
                    @checkoutAddAddressFormIsVisible="
                      setBillingAddressFormVisible(true)
                    "
                    @checkoutAddAddressFormIsNotVisible="
                      setBillingAddressFormVisible(false)
                    "
                    @checkoutEditAddressFormIsVisible="
                      setBillingAddressFormVisible(true)
                    "
                    @checkoutEditAddressFormIsNotVisible="
                      setBillingAddressFormVisible(false)
                    "
                    @changeDefaultAddress="updateDefaultAddress"
                    @mountedAddressForm="setAddressFormComponent"
                    @toggleAddressEdit="setCurrentStep"
                    @toggleBillingAsShipping="toggleBillingAsShipping"
                    @refreshAddressList="getUserAddresses"
                    @checkoutAddressManagerIsVisible="
                      setBillingAddressManagerVisible(true)
                    "
                    @checkoutAddressManagerIsNotVisible="
                      setBillingAddressManagerVisible(false)
                    "
                  />
                  <b-form-checkbox
                    v-if="billingAddressFormVisible"
                    class="text-muted"
                    :checked="billingAsShipping"
                    @change="toggleBillingAsShipping"
                  >
                    {{ $t('billing_as_shipping') }}
                  </b-form-checkbox>
                  <b-button
                    v-if="
                      billingAddressFormVisible || billingAddressManagerVisible
                    "
                    class="mt-3"
                    @click="
                      !billingAsShipping
                        ? forceSubmit(billingAddressFormComponent)
                        : forceSubmit(
                            billingAddressFormComponent,
                            shippingAddressFormComponent
                          )
                    "
                  >
                    <span v-if="!billingAsShipping">{{
                      $t('use_billing_address')
                    }}</span>
                    <span v-else>{{ $t('use_address') }}</span>
                  </b-button>
                </b-card>
              </div>
              <div id="shippingAddressBlock" class="mt-3">
                <h5>{{ $t('shipping_address') }}</h5>
                <b-card>
                  <CheckoutAddressManager
                    title="Indirizzo di spedizione"
                    :type="shippingAddressType"
                    :step="2"
                    :country-list="countryList"
                    :address-list="shippingAddressList"
                    :default-address="defaultShippingAddress"
                    :billing-address="defaultBillingAddress"
                    :billing-as-shipping="billingAsShipping"
                    @checkoutAddAddressFormIsVisible="
                      setShippingAddressFormVisible(true)
                    "
                    @checkoutAddAddressFormIsNotVisible="
                      setShippingAddressFormVisible(false)
                    "
                    @checkoutEditAddressFormIsVisible="
                      setShippingAddressFormVisible(true)
                    "
                    @checkoutEditAddressFormIsNotVisible="
                      setShippingAddressFormVisible(false)
                    "
                    @changeDefaultAddress="updateDefaultAddress"
                    @mountedAddressForm="setAddressFormComponent"
                    @toggleAddressEdit="setCurrentStep"
                    @refreshAddressList="getUserAddresses"
                    @checkoutAddressManagerIsVisible="
                      setShippingAddressManagerVisible(true)
                    "
                    @checkoutAddressManagerIsNotVisible="
                      setShippingAddressManagerVisible(false)
                    "
                  />
                  <b-button
                    v-if="
                      (shippingAddressFormVisible && !billingAsShipping) ||
                      shippingAddressManagerVisible
                    "
                    class="mt-3"
                    @click="forceSubmit(shippingAddressFormComponent)"
                    >Usa questo indirizzo di spedizione
                  </b-button>
                </b-card>
              </div>
              <div id="paymentMethodBlock" class="mt-3">
                <h5>Metodo di pagamento</h5>
                <b-card>
                  <div v-show="currentStep > 2" role="tablist">
                    <div v-if="paymentList.length === 0" class="text-center">
                      <b-spinner class="ml-2 main-color" />
                    </div>
                    <b-card
                      v-for="(payment, name, idx) in paymentList"
                      :key="name"
                      no-body
                      class="mb-0 rounded-0"
                    >
                      <b-card-header
                        header-tag="header"
                        class="p-0"
                        role="tab"
                        style="height: 100px"
                      >
                        <b-button
                          v-b-toggle="'accordion-' + name"
                          style="height: 100%"
                          class="text-dark text-left text-decoration-none rounded-0"
                          block
                          href="#"
                          variant="link"
                        >
                          <b-img
                            v-if="
                              showIconPayment.includes(name) &&
                              !showTextPayment.includes(name)
                            "
                            style="
                              max-height: 80px;
                              max-width: 80px;
                              margin-right: 5px;
                              vertical-align: middle;
                            "
                            :src="getPaymentTypeIconUrl(name)"
                          />
                          <span
                            v-if="
                              showIconPayment.includes(name) &&
                              showTextPayment.includes(name)
                            "
                          >
                            <b-img
                              style="
                                max-height: 40px;
                                max-width: 40px;
                                margin-right: 5px;
                                vertical-align: middle;
                              "
                              :src="getPaymentTypeIconUrl(name)"
                            />
                            <span
                              style="
                                font-size: 20px;
                                line-height: 4em;
                                vertical-align: middle;
                              "
                            >
                              {{ payment.name }}</span
                            ></span
                          >
                          <span
                            v-if="
                              !showIconPayment.includes(name) &&
                              showTextPayment.includes(name)
                            "
                            style="
                              font-size: 20px;
                              line-height: 4em;
                              vertical-align: middle;
                            "
                          >
                            {{ payment.name }}</span
                          >
                        </b-button>
                      </b-card-header>
                      <b-collapse
                        :id="'accordion-' + name"
                        :data-paymentId="payment.id"
                        :visible="idx === 0"
                        accordion="my-accordion"
                        role="tabpanel"
                      >
                        <b-card-body>
                          <b-card-text>
                            <div v-if="payment.type === 'bt'" class="mb-2">
                              <braintree-vault
                                :id="payment.id"
                                :amount="totalAmount"
                                :billing-address="billingAddress"
                                :shipping-address="shippingAddress"
                                :force-storage="hasNotAvailableItems"
                                :type="name"
                                @braintreeVaultMounted="setPaymentComponent"
                                @verification-success="makeCheckout"
                                @choosePayment="changePaymentMethod"
                                @error="processingPayment = false"
                              />
                            </div>
                            {{ payment.desc }}
                          </b-card-text>
                        </b-card-body>
                      </b-collapse>
                    </b-card>
                  </div>
                  <span v-show="currentStep <= 2" class="text-muted"
                    >Scelta metodo pagamento</span
                  >
                </b-card>
              </div>
              <div class="mt-3">
                <h5>Articoli e spedizioni</h5>
                <div v-if="productList.length === 0" class="text-center">
                  <b-spinner
                    label="Loading..."
                    style="width: 3rem; height: 3rem"
                    class="m-2"
                    variant="secondary"
                  >
                  </b-spinner>
                </div>
                <div
                  v-if="productList.length === 0"
                  class="text-center text-muted"
                >
                  Loading...
                </div>
                <span
                  v-for="(groups, available) in productList"
                  :key="available"
                >
                  <b-card
                    v-for="(group, key) in groups"
                    :key="available + key"
                    class="mb-3"
                  >
                    <b-row
                      v-for="(item, idx) in group.item"
                      :key="idx"
                      :class="{ 'mt-3': idx > 0 }"
                    >
                      <b-col
                        v-if="idx === 0"
                        cols="12"
                        class="mb-0 mb-md-3 mb-lg-3 order-1"
                        ><strong>
                          <delivery-message
                            :delivery-date="item.delivery.date"
                            :thru-date="item.delivery.orderLimit" /></strong
                      ></b-col>
                      <b-col cols="4" class="order-3 order-md-2 order-lg-3">
                        <b-img
                          thumbnail
                          fluid
                          :src="thumbImagePath(item.thumbImagePath)"
                          :alt="item.brand + ' ' + item.code"
                        ></b-img>
                      </b-col>
                      <b-col
                        cols="8"
                        md="4"
                        lg="4"
                        class="d-flex flex-column order-4 order-md-3 order-lg-3"
                      >
                        <small
                          ><strong
                            >{{ item.brand }} {{ item.code }}</strong
                          ></small
                        >
                        <small class="checkout-item-description">
                          {{ item.name }}
                        </small>
                        <div class="d-flex flex-fill flex-row mt-3">
                          <div class="flex-fill">
                            <countdown-timer
                              :thru-date="item.discountThruDate"
                            />
                          </div>
                        </div>
                        <div class="d-flex flex-fill flex-row">
                          <strong class="flex-fill">
                            <Price :amount="item.sellPrice"></Price>
                          </strong>
                          <span class="d-block d-md-none d-lg-none">
                            x<strong>{{ item.quantity }}</strong>
                          </span>
                          <span class="d-none d-md-block d-lg-block">
                            Quantità: <strong>{{ item.quantity }}</strong>
                          </span>
                        </div>
                        <AvailabilityText
                          strong
                          :type="item.availability"
                        ></AvailabilityText>
                      </b-col>
                      <b-col
                        v-if="idx === 0"
                        cols="12"
                        md="4"
                        lg="4"
                        class="order-2 order-md-4 order-lg-4"
                      >
                        <hr class="d-block d-md-none d-lg-none" />
                        <b-form-group>
                          <b-form-radio
                            v-for="(
                              shippingMethod, shippingKey
                            ) in group.shipping"
                            :key="shippingKey"
                            v-model="shipment[available + key]"
                            :value="shippingMethod.shippingMethodId"
                            :name="available + key"
                            @change="setShipmentAmount"
                          >
                            <Price
                              :show-text-at-zero="true"
                              :hide-zero="true"
                              :amount="shippingMethod.cost"
                            ></Price>
                            {{ shippingMethod.name }}
                          </b-form-radio>
                        </b-form-group>
                        <hr class="d-block d-md-none d-lg-none" />
                      </b-col>
                    </b-row>
                  </b-card>
                </span>
              </div>
            </b-col>
          </b-row>
        </b-container>
        <div
          class="confirm-block jumbotron pt-2"
          :class="{ 'd-none': checkoutSuccess === false }"
        >
          <div class="container">
            <h1 class="mt-5 display-5 text-center">Ordine confermato!</h1>
            <p class="mt-4 lead text-muted text-center">
              Riceverai a breve una mail riepilogativa del tuo ordine
              all'indirizzo
              <strong class="text-dark">
                {{ $store.getters.getUserInfo.email }}</strong
              >.
            </p>
            <p class="mt-4 lead text-muted text-center">
              I riferimenti dell'ordine sono:
              <strong class="text-dark">{{ orderId.join(', ') }}</strong
              >.
            </p>

            <hr class="my-4" />
            <p class="text-center text-muted">
              <b-link to="/order" class="text-decoration-none main-color"
                >Clicca qui per verificare lo stato dell'ordine</b-link
              >
            </p>
          </div>
        </div>
      </section>
      <b-modal
        ref="modal-availability-changed"
        ok-only
        cancel-variant="danger"
        ok-variant="main-color"
        ok-title="Chiudi"
        title="Il tuo carrello si è aggiornato!"
      >
        <p class="my-4">
          Il tuo carrello ha subito modifiche a causa dei seguenti aggiornamenti
          per gli articoli:
        </p>
        <ul>
          <li v-for="(item, key) in availabilityException" :key="key">
            <template v-if="item.reasonCode === 'updatedQuantity'">
              {{ item.itemName }} la quantità è stata modificata da
              {{ item.cartQuantity }} a {{ item.purchasableQuantity }}.
            </template>
            <template v-else-if="item.reasonCode === 'deleted'">
              {{ item.itemName }} è stato rimosso dal carrello perchè non più
              disponibile.
            </template>
            <!--<template v-else-if="item.reasonCode === 'updated_price'">
            {{ item.itemName }} il prezzo è stato modificato da
            <Price :amount="item.cartItemPrice"></Price>
            a
            <Price :amount="item.itemPrice"></Price>
            .
          </template>
          <template v-else-if="item.reasonCode === 'moved_quantity'">
            Uno o più articoli potrebbero aver cambiato la data di consegna.
          </template>-->
          </li>
        </ul>
        <p class="my-4">
          Per completare l'ordine chiudi questo messaggio per vedere il
          risultato degli aggiornamenti e procedere con il checkout.
          <b-link to="/cart">Rivedi il il tuo carrello</b-link>
        </p>
      </b-modal>
    </client-only>
    <b-overlay :show="processingCheckout" no-wrap fixed style="z-index: 1030">
      <template #overlay>
        <div class="text-center p-4 main-background text-light rounded">
          <b-spinner style="width: 6rem; height: 6rem"></b-spinner>
          <div class="mb-3">
            <font-awesome-icon icon="clipboard-check" size="lg" />
            {{ $t('checkout_transaction_overlay_lock') }}
          </div>
        </div>
      </template>
    </b-overlay>
  </span>
</template>

<script>
import { cartMixin } from '@/mixins/cartMixin'

const MINIMAL_AMOUNT = 0.01

export default {
  name: 'CheckoutPage',
  mixins: [cartMixin],
  layout: 'minimal',
  middleware: 'isAuthenticated',
  data() {
    return {
      publicPath: process.env.BASE_URL,
      error: null,
      steps: [1, 2, 3, 4],
      currentStep: 1,
      billingAddressFormVisible: false,
      shippingAddressFormVisible: false,
      billingAddressFormComponent: null,
      shippingAddressFormComponent: null,
      billingAddressManagerVisible: false,
      shippingAddressManagerVisible: false,
      billingAsShipping: false,
      countryList: [],
      paymentList: [],
      productList: [],
      billingAddressList: [],
      shippingAddressList: [],
      billingAddressType: 'billing',
      shippingAddressType: 'shipping',
      defaultBillingAddress: null,
      defaultShippingAddress: null,
      billingAddress: {},
      shippingAddress: {},
      defaultPaymentMethod: null,
      paymentMethod: {
        id: null,
        type: null,
        value: null,
        store: null,
      },
      partialAmount: 0.0,
      shipment: [],
      shipmentAmount: [],
      shipmentTotalAmount: 0.0,
      amount: [],
      totalAmount: 0.0, // dots overs commas, 2 decimal,
      subTotalAmount: 0.0,
      totalCouponAmount: [],
      subTotalCouponAmount: 0.0,
      creditCardComponent: null,
      payPalComponent: null,
      localPaymentComponent: null,
      visiblePaymentAccordion: null,
      couponKey: null,
      usedCouponKey: null,
      couponAmount: null,
      maxUsableCouponAmount: null,
      couponMsg: null,
      couponError: null,
      couponSuccessCountDown: 0,
      couponErrorCountDown: 0,
      couponSec: 2,
      balanceAmount: null,
      maxUsableBalanceAmount: null,
      useBalance: false,
      processingPayment: false,
      processingCheckout: false,
      chosenCCToken: null,
      chosenPPToken: null,
      account: 0,
      checkoutSuccess: false,
      orderId: [],
      visible: true,
      firstLoading: true,
      validCart: false,
      mustRevalidateCard: false,
      env: process.env,
      availabilityException: {},
      showIconPayment: ['credit-card', 'paypal', 'mybank', 'bank-transfer'],
      showTextPayment: [
        'credit-card',
        'bank-transfer',
        'financing',
        'revolve-payment-card',
      ],
      numberOrder: null,
    }
  },
  head() {
    return {
      title: this.$t('title.checkout'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
  computed: {
    hasNotAvailableItems() {
      return !!this.productList.preorder || !!this.productList.outOfStock
    },
  },
  watch: {
    subTotalAmount(newValue, oldValue) {
      if (newValue !== oldValue) this.insertCoupon()
    },
  },
  beforeMount() {
    const that = this
    this.getCountryList()
    this.getBalance()
    this.getUserAddresses(true, function () {
      that.getPaymentMethods()
      that.getProducts()
    })
    if (process.env.VUE_APP_PROMO_KEY !== '')
      this.couponKey = process.env.VUE_APP_PROMO_KEY
  },
  mounted() {
    const that = this
    this.$store.watch(
      (state, getters) => getters.hasPageNotScrolled,
      (newValue) => {
        if (window.screen.width <= 768) {
          that.visible = newValue
        }
      }
    )
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (
        collapseId === 'collapse-coupon' ||
        collapseId === 'collapse-balance' ||
        collapseId === 'collapse-total-detail'
      )
        return false
      if (
        isJustShown === true &&
        that.defaultBillingAddress &&
        that.defaultShippingAddress
      ) {
        that.setCurrentStep(3)
        that.defaultPaymentMethod = null
        that.visiblePaymentAccordion = collapseId
        that.defaultPaymentMethod = collapseId.replace('accordion-', '')
        if (
          that.defaultPaymentMethod !== 'credit-card' &&
          that.defaultPaymentMethod !== 'paypal'
        ) {
          const paymentData = {
            id: document
              .querySelector('#' + collapseId)
              .getAttribute('data-paymentid'),
            type: null,
            value: null,
            store: null,
          }
          this.setPaymentMethod(paymentData)
        } else if (that.defaultPaymentMethod === 'credit-card') {
          this.creditCardComponent.setDefaultPaymentMethod()
        } else if (that.defaultPaymentMethod === 'paypal') {
          this.payPalComponent.setDefaultPaymentMethod()
        }
      }
    })
  },
  methods: {
    getPaymentTypeIconUrl(type) {
      return require(`~/assets/img/payment_type_logo/${type}.svg`)
    },
    setShipmentAmount() {
      for (const [available, groups] of Object.entries(this.productList)) {
        for (const [key, group] of Object.entries(groups)) {
          group.shipping.forEach((shipment) => {
            if (this.shipment[available + key] === shipment.shippingMethodId)
              this.shipmentAmount[available + key] = shipment.cost
          })
        }
      }
      this.calculateTotal()
    },
    setCurrentStep(step = null) {
      if (step) this.currentStep = step
      else if (!this.defaultBillingAddress) this.currentStep = 1
      else if (!this.defaultShippingAddress) this.currentStep = 2
      else if (!this.defaultPaymentMethod) this.currentStep = 3
      else this.currentStep = 4
    },
    setAddressFormComponent(component, type) {
      if (type === this.billingAddressType)
        this.billingAddressFormComponent = component
      else if (type === this.shippingAddressType)
        this.shippingAddressFormComponent = component
    },
    setPaymentComponent(component, type) {
      if (type === 'credit-card') this.creditCardComponent = component
      else if (type === 'paypal') this.payPalComponent = component
      else if (type === 'sofort' || type === 'mybank')
        this.localPaymentComponent = component
    },
    localPayment(type) {
      this.processingPayment = true
      this.calculateTotal()
      this.localPaymentComponent.createLocalPayment(type)
    },
    setBillingAddressFormVisible(value) {
      this.billingAddressFormVisible = value
    },
    setShippingAddressFormVisible(value) {
      this.shippingAddressFormVisible = value
    },
    setPaymentMethod(data) {
      this.paymentMethod.id = data.id
      this.paymentMethod.type = data.type
      this.paymentMethod.value = data.value
      this.paymentMethod.store = data.store
    },
    toggleBillingAsShipping(value = null) {
      if (value !== null) this.billingAsShipping = value
      else this.billingAsShipping = !this.billingAsShipping
    },
    forceSubmit(component, component2 = null) {
      if (
        component.$parent.edit === true &&
        component.$parent.addAddress === false &&
        component.$parent.editAddress === false
      ) {
        component.$parent.updateDefaultAddress()
        component.$parent.closeEdit()
        this.setCurrentStep()
      } else {
        const form = component.form
        let result = component.touch()
        if (result && !component2) this.setCurrentStep(this.currentStep + 1)
        if (component2) {
          component2.setForm(form)
          result = component2.touch()
          if (result) this.setCurrentStep(3)
          this.billingAsShipping = false
        }
      }
    },
    makeCheckout(data) {
      this.setPaymentMethod(data)
      this.checkout()
    },
    changePaymentMethod(type, token, id) {
      let paymentData = {}
      if (!token && type === 'credit-card') this.chosenCCToken = null
      if (!token && type === 'paypal') this.chosenPPToken = null
      if (token && type === 'credit-card') {
        this.chosenCCToken = token
        paymentData = {
          id,
          type: 'token',
          value: this.chosenCCToken,
          store: false,
        }
      } else if (token && type === 'paypal') {
        this.chosenPPToken = token
        paymentData = {
          id,
          type: 'token',
          value: this.chosenPPToken,
          store: false,
        }
      }
      this.setPaymentMethod(paymentData)
      if (this.firstLoading) {
        this.firstLoading = false
        if (this.defaultBillingAddress && this.defaultShippingAddress)
          this.setCurrentStep(4)
      }
    },
    calculateTotal() {
      let subTotalAmount = 0
      let subTotalCouponAmount = 0
      let shipmentTotalAmount = 0
      this.numberOrder = 0
      for (const [available, groups] of Object.entries(this.productList)) {
        for (const [key] of Object.entries(groups)) {
          shipmentTotalAmount += this.shipmentAmount[available + key]
          subTotalAmount += this.amount[available + key]
          subTotalCouponAmount += this.totalCouponAmount[available + key]
          this.numberOrder++
        }
      }
      this.subTotalAmount = parseFloat(subTotalAmount.toFixed(2))
      this.shipmentTotalAmount = parseFloat(shipmentTotalAmount.toFixed(2))
      const couponAmount = this.maxUsableCouponAmount
        ? this.maxUsableCouponAmount
        : 0
      const balanceAmount = this.maxUsableBalanceAmount
        ? this.maxUsableBalanceAmount
        : 0
      const totalAmount =
        subTotalAmount + shipmentTotalAmount - couponAmount - balanceAmount
      this.totalAmount = parseFloat(totalAmount.toFixed(2))
      this.subTotalCouponAmount = parseFloat(subTotalCouponAmount.toFixed(2))
    },
    payWithCreditCard() {
      this.processingPayment = true
      this.calculateTotal()
      if (this.chosenCCToken === null) {
        this.creditCardComponent.verifyCC()
      } else if (this.mustRevalidateCard) {
        this.creditCardComponent.verifyVaultedCC()
      } else {
        this.checkout()
      }
    },
    payWithPayPal() {
      this.processingPayment = true
      this.calculateTotal()
      if (this.chosenPPToken !== null) {
        this.checkout()
      }
    },
    payWithOther() {
      this.processingPayment = true
      this.calculateTotal()
      this.paymentMethod = {
        id: this.paymentMethod.id,
      }
      this.checkout()
    },
    choosePaymentMethod() {
      this.setCurrentStep(4)
      for (const paymentMethod in this.paymentList) {
        if (
          paymentMethod === this.defaultPaymentMethod &&
          paymentMethod === 'paypal' &&
          this.chosenPPToken === null
        ) {
          let type = 'checkout'
          if (this.payPalComponent.storePayPalAccount === 1) {
            type = 'vault'
          }
          this.payPalComponent.setPayPalBtn(type)
        }
      }
    },
    getCountryList() {
      this.$axios
        .get(`country?active=1`)
        .then((res) => {
          this.countryList = res.data
        })
        .catch((err) => {
          this.error = err
        })
    },
    getPaymentMethods() {
      this.paymentList = []
      this.$axios
        .get(`payments`)
        .then((res) => {
          this.paymentList = res.data
        })
        .catch((err) => {
          this.error = err
        })
    },
    getProducts() {
      this.$axios
        .post(`checkout/items`, {
          shippingAddressId: this.defaultShippingAddress,
        })
        .then((res) => {
          const response = res.data
          if (!this.checkValidCart(response)) {
            return false
          }
          for (const [available, groups] of Object.entries(response)) {
            for (const [key, group] of Object.entries(groups)) {
              this.shipment[available + key] =
                group.shipping[0].shippingMethodId
              this.shipmentAmount[available + key] = group.shipping[0].cost
              this.amount[available + key] = group.total
              this.totalCouponAmount[available + key] = group.couponTotal
            }
          }
          this.productList = response
          this.calculateTotal()
        })
        .catch((err) => {
          this.error = err
        })
    },
    getCart() {
      const result = {}
      const items = {}
      for (const [available, groups] of Object.entries(this.productList)) {
        result[available] = []
        for (const [key, group] of Object.entries(groups)) {
          items[available + key] = []
          group.item.forEach((item) => {
            items[available + key].push({
              itemId: item.itemId,
              quantity: item.quantity,
            })
          })
          result[available].push({
            item: items[available + key],
            shippingMethodId: this.shipment[available + key],
          })
        }
      }
      return result
    },
    checkValidCart(cart) {
      if (Object.keys(cart).length > 0) {
        this.validCart = true
        return true
      } else {
        this.$router.push({ name: 'cart' })
        return false
      }
    },
    getUserAddresses(setDefault = true, callback = null, step = null) {
      this.billingAddressList = []
      this.shippingAddressList = []
      this.$axios
        .get(`user-address?active=1`)
        .then((res) => {
          let defaultBillingAddress = null
          let defaultShippingAddress = null
          for (const addressType in res.data) {
            let c = 0
            for (const address in res.data[addressType]) {
              if (addressType === this.billingAddressType)
                this.billingAddressList.push(res.data[addressType][address])
              else if (addressType === this.shippingAddressType)
                this.shippingAddressList.push(res.data[addressType][address])
              if (res.data[addressType][address].default === '1' || c === 0) {
                if (addressType === this.billingAddressType)
                  defaultBillingAddress = res.data[addressType][address]
                else if (addressType === this.shippingAddressType)
                  defaultShippingAddress = res.data[addressType][address]
              }
              c++
            }
          }
          if (setDefault) {
            if (defaultBillingAddress) {
              this.defaultBillingAddress = defaultBillingAddress.id
              this.billingAddress = defaultBillingAddress
            } else {
              this.defaultBillingAddress = null
              this.billingAddress = {}
            }

            if (defaultShippingAddress) {
              this.defaultShippingAddress = defaultShippingAddress.id
              this.shippingAddress = defaultShippingAddress
            } else {
              this.defaultShippingAddress = null
              this.shippingAddress = {}
            }
          }
          if (!this.defaultBillingAddress && !this.defaultShippingAddress)
            this.toggleBillingAsShipping()
          this.setCurrentStep(step)
          if (callback) callback()
        })
        .catch((err) => {
          this.error = err
        })
    },
    checkout() {
      this.processingCheckout = true
      const checkoutObj = {
        billingAddressId: this.billingAddress.id,
        shippingAddressId: this.shippingAddress.id,
        paymentMethod: this.paymentMethod,
        cart: this.getCart(),
      }
      if (this.couponKey) checkoutObj.couponKey = this.couponKey
      if (this.maxUsableBalanceAmount)
        checkoutObj.balanceAmount = this.maxUsableBalanceAmount.toFixed(2)
      this.$axios
        .post(`checkout`, checkoutObj)
        .then((res) => {
          if (res.data.success) {
            this.processingCheckout = false
            this.checkoutSuccess = true
            this.orderId = res.data.orderId
            this.setEmptyStoreCart()
          } else {
            this.processingPayment = false
            this.processingCheckout = false
            this.checkoutSuccess = false
            this.error = res.data.error
            this.orderId = []
            if (res.data.error === 'itemNotMatch') {
              this.error = this.$t('checkout.error.itemNotMatch')
              this.getProducts()
            }
            if (res.data.availabilityException.length > 0) {
              this.availabilityException = res.data.availabilityException
              this.showModalAvailabilityChanged()
              this.getProducts()
            }
          }
        })
        .catch((err) => {
          this.processingPayment = false
          this.error = err.response.data.error
          this.checkoutSuccess = false
          this.orderId = []
        })
    },
    updateDefaultAddress(addressType, newValue) {
      if (addressType === this.billingAddressType) {
        this.defaultBillingAddress = newValue
        this.billingAddress = this.billingAddressList.find(
          (address) => address.id === newValue
        )
      } else if (addressType === this.shippingAddressType) {
        this.defaultShippingAddress = newValue
        this.shippingAddress = this.shippingAddressList.find(
          (address) => address.id === newValue
        )
        this.defaultPaymentMethod = null
        this.mustRevalidateCard = true
      }
      this.getPaymentMethods()
      this.getProducts()
    },
    insertCoupon() {
      const that = this
      this.$axios
        .get(`coupon?key=${this.couponKey}&amount=${this.subTotalCouponAmount}`)
        .then((res) => {
          that.removeCoupon()
          if (res.data.valid === true) {
            that.couponAmount = res.data.amount
            that.maxUsableCouponAmount = that.couponAmount
            if (this.couponAmount >= this.totalAmount)
              that.maxUsableCouponAmount = this.calculateMinimalAmount()
            that.couponMsg = 'Coupon inserito correttamente'
            that.usedCouponKey = res.data.key
            that.couponSuccessCountDown = that.couponSec
          } else {
            that.couponError = 'Coupon non valido'
            if (res.data.error === 'insufficientAmount')
              that.couponError = 'Importo insufficiente.'
            that.couponErrorCountDown = that.couponSec
          }
          if (that.useBalance) that.toggleBalance(false)
          that.calculateTotal()
          if (that.useBalance) that.toggleBalance(true)
        })
        .catch((err) => {
          this.error = err
        })
    },
    removeCoupon() {
      this.maxUsableCouponAmount = 0
      this.calculateTotal()
    },
    getBalance() {
      const that = this
      this.$axios
        .get(`balance`)
        .then((res) => {
          if (res.data.success === true) that.balanceAmount = res.data.amount
        })
        .catch((err) => {
          this.error = err
        })
    },
    toggleBalance(value) {
      if (value) {
        this.maxUsableBalanceAmount = this.balanceAmount
        if (this.balanceAmount >= this.totalAmount)
          this.maxUsableBalanceAmount = this.calculateMinimalAmount()
      } else {
        this.maxUsableBalanceAmount = null
      }
      this.calculateTotal()
    },
    calculateMinimalAmount() {
      return this.totalAmount - MINIMAL_AMOUNT * this.numberOrder
    },
    showModalAvailabilityChanged() {
      this.$refs['modal-availability-changed'].show()
    },
    setBillingAddressManagerVisible(value) {
      this.billingAddressManagerVisible = value
    },
    setShippingAddressManagerVisible(value) {
      this.shippingAddressManagerVisible = value
    },
  },
}
</script>

<style>
.checkout-item-description {
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
