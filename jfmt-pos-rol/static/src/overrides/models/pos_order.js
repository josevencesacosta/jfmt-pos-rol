import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";

patch(PosOrder.prototype, {
    export_for_printing(baseUrl, headerData) {
        const receipt = super.export_for_printing(baseUrl, headerData);
        receipt.l10n_latam_document_type_id = this.l10n_latam_document_type_id || false;
        console.log('receipt.orderlines:::::::::::::::::::::::: ', receipt.orderlines)
        console.log('this.getSortedOrderlines():::::::::::::::::: ', this.getSortedOrderlines())
        //orderlines: this.getSortedOrderlines().map((l) =>
        //    omit(l.getDisplayData(), "internalNote")
        //)
        return receipt;
    },
});
