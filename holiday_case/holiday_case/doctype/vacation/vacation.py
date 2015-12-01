# -*- coding: utf-8 -*-
# Copyright (c) 2015, New Indictrans and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import nowdate

class Vacation(Document):
	def on_submit(self):
		# self.make_leave_application()
		self.make_expense_claim()

	def make_leave_application(self):
		lap = frappe.new_doc('Leave Application')
		lap.status = 'Approved'
		lap.leave_type = self.vacation_type
		lap.from_date = self.start_date
		lap.to_date = self.end_date
		lap.employee = self.employee
		lap.employee_name = self.employee_name
		lap.posting_date = nowdate()
		lap.leave_approver = frappe.session.user()
		lap.submit()

	def make_expense_claim(self):
		pass

@frappe.whitelist()
def get_employee_details(employee):
	data =  frappe.db.get_values('Vacation', {'employee': employee, 'docstatus': 1, 'workflow_state': 'Approved'}, '*', as_dict=1, order_by = 'modified')
	salary = frappe.db.get_value('Salary Structure', {'employee': employee, 'is_active': 'Yes'}, 'net_pay') or 0.0
	count = len(data) if data else 0
	return {
		'number_of_vacation': count,
		'last_flight_date_and_flight_type': data[count-1].flight_type if data else '',
		'last_vacation_date': data[count-1].end_date if data else '',
		'basic_salary': salary
	}
