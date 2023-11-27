import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAeroportoPeloId from '@salesforce/apex/VooService.getAeroportoPeloId';
import calculateDistance from '@salesforce/apex/VooService.calculateDistance';
import getUltimoVoo from '@salesforce/apex/VooService.getUltimoVoo';

export default class VooForms extends LightningElement {
    aeroPartida;
    aeroChegada;
    distancia;
    ultimoVoo = [];
    ultimoId;
    flag = false;
    disableBotao = true;
    objeto = {};
    columns = [
        { label: 'Aeroporto de Partida', fieldName: 'aeroportoPartida' },
        { label: 'Aeroporto de Chegada', fieldName: 'aeroportoChegada'},
        { label: 'Distância', fieldName: 'distancia'},
    ];
    idTabela;

    calculaDistancia() {
        if (this.aeroPartida && this.aeroChegada) {
            calculateDistance(
                {
                    latitude1: this.aeroPartida.Coordenadas__c.latitude,
                    longitude1: this.aeroPartida.Coordenadas__c.longitude,
                    
                    latitude2: this.aeroChegada.Coordenadas__c.latitude,
                    longitude2: this.aeroChegada.Coordenadas__c.longitude 
                }
            )
            .then(data => {
                this.distancia = data/1000;
                this.disableBotao = false;                
            })
        }
    }

    changeAeroportoPartida(event){
        getAeroportoPeloId({ id: `${event.detail.value}` })
        .then(data => {
            this.aeroPartida = data;
            this.calculaDistancia();
        })
    }

    changeAeroportoChegada(event){
        getAeroportoPeloId({ id: `${event.detail.value}` })
        .then(data => {
            this.aeroChegada = data;
            this.calculaDistancia();
        })
    }

    handleSuccess(event) {
        this.showToast();
        this.ultimoId = event.detail.id;
        this.metodoUltimoVoo();
        this.resetFields();
    }

    showToast() {
        const event = new ShowToastEvent({
            title: 'Sucesso',
            message:
                'Voo cadastrado com sucesso',
            variant: 'success'
        });
        this.dispatchEvent(event);
    }

    metodoUltimoVoo(){
        getUltimoVoo({ id: `${this.ultimoId}`})
        .then(data => {
            this.objeto = {
                aeroportoPartida: data.Aeroporto_Partida__r.Nome_do_Aeroporto__c,
                aeroportoChegada: data.Aeroporto_Chegada__r.Nome_do_Aeroporto__c,
                distancia: data.Distancia__c
            };
            this.idTabela = data.Id;
            this.ultimoVoo = [this.objeto];
            this.flag = true;
        })
    }

    resetFields() {
        this.template.querySelectorAll('lightning-input-field').forEach(field => field.reset());
        this.disableBotao = true;
        this.distancia = null;
        this.aeroPartida = null;
        this.aeroChegada = null;
    }
}