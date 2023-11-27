public class VooService {
	@AuraEnabled(cacheable=true)
	public static Aeroporto__c getAeroportoPeloId(String id) {
		Aeroporto__c aero = [ SELECT Name, Nome_do_Aeroporto__c, Coordenadas__c from Aeroporto__c WHERE Id = :id ];
   		return aero;
 	}

	@AuraEnabled(cacheable=true)
	public static Voo__c getUltimoVoo(String id){
		Voo__c ultimoVoo = [SELECT Aeroporto_Partida__r.Name, Aeroporto_Partida__r.Nome_do_Aeroporto__c, Aeroporto_Chegada__r.Name, Aeroporto_Chegada__r.Nome_do_Aeroporto__c, Distancia__c from Voo__c WHERE Id = :id];
		return ultimoVoo;
	}

	 @AuraEnabled(cacheable=true)
	 public static Decimal calculateDistance(Decimal latitude1, Decimal longitude1, Decimal latitude2, Decimal longitude2) {
	 Integer earthRadius = 6371 * 1000; // in meters
	 // Transform coordinates from degrees to radians
	 Decimal latitudeRadians1 = latitude1 * Math.PI/180;
	 Decimal latitudeRadians2 = latitude2 * Math.PI/180;
	 // Latitude and longitude differences in radians
	 Decimal latitudeDelta = (latitude2 - latitude1) * Math.PI/180;
	 Decimal longitudeDelta = (longitude2 - longitude1) * Math.PI/180;
	 Decimal a = Math.sin(latitudeDelta/2) * Math.sin(latitudeDelta/2) +
	 Math.cos(latitudeRadians1) * Math.cos(latitudeRadians2) *
	 Math.sin(longitudeDelta/2) * Math.sin(longitudeDelta/2);
	 Decimal arc = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	 Decimal distance = earthRadius * arc; // in metres
	 return distance;
	 }

}