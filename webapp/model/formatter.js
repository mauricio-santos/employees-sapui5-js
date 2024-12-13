sap.ui.define([], function () {
    return {
        dateFormat: function (date) {
            // var dateNow = new Date();
            // var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy/MM/dd" });
            // var dateNowFormat = new Date(dateFormat.format(dateNow));
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(date)
            const diffDaysTime = selectedDate.getTime() - today.getTime();
            const timeDay = 1000 * 60 * 60 * 24; //Conversão de 1 dia em Milissegundos(ms)
            const countDay = Math.round(diffDaysTime / timeDay)
            const i18n = this.getView().getModel("i18n").getResourceBundle();
            
            switch (countDay){
                case 0: return i18n.getText("incidenceToday");
                case 1: return i18n.getText("IncidenceTomorrow");
                case -1: return i18n.getText("incidenceYesterday");
            }
            
            if (countDay > 1){
                return i18n.getText("incidenteInXDay", [countDay]);
            } else if (countDay < 1) {
                return i18n.getText("incidenteXDayAgo", [Math.abs(countDay)]);
            }else {
                return '';
            }
        }
    }
});