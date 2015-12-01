
frappe.ui.form.on("Vacation", "refresh", function(frm){
	if(frm.doc.workflow_state == 'Rejected'){
		frm.set_read_only()
	}

	if(frm.doc.employee){
		frm.cscript.get_employee_details()
	}
})

frappe.ui.form.on("Vacation", "employee", function(frm){	
	frm.cscript.get_employee_details()
})

cur_frm.cscript.get_employee_details= function(){
	var doc = cur_frm.doc

	frappe.call({
		method: "holiday_case.holiday_case.doctype.vacation.vacation.get_employee_details",
		args: {employee : doc.employee},
		callback: function(r){
			if(r.message){
				$.each(r.message, function(field, value) {
					cur_frm.set_value(field, value);
				})
			}
		}
	})
}

frappe.ui.form.on("Vacation", "one_way_trip", function(frm){
	var doc = frm.doc
	if(cint(frm.doc.one_way_trip) == 1){
		cur_frm.set_value('flight_type', 'Date: '+ doc.flight_date+ ' Type: One Way Trip')
		cur_frm.set_value('round_trip', 0)
	}
})

frappe.ui.form.on("Vacation", "round_trip", function(frm){
	var doc = frm.doc
	if(cint(frm.doc.round_trip) == 1){
		cur_frm.set_value('flight_type', 'Date: '+ doc.flight_date+ ' Type: Round Trip')
		cur_frm.set_value('one_way_trip', 0)
	}
})
