from datetime import date
from typing import cast, Self
from viewflow import fsm

from emprestimo.choices import LoanState
from emprestimo.models import Loan


class LoanFlow:
    state = fsm.State(LoanState, default=LoanState.OBTENDED.value)

    def __init__(self, loan: Loan) -> None:
        self.loan = loan

    @state.getter()
    def _get_state(self):
        return self.loan.status

    @state.setter()
    def _set_state(self, value):
        self.loan.status = value

    @state.transition(
        source=[
            LoanState.OBTENDED.value,
            LoanState.POSTPONED.value,
        ],
        target=LoanState.RETURNED.value,
        conditions=[
            lambda flow: cast(Self, flow).loan.return_date >= date.today()
            or cast(Self, flow).loan.postponed_date
            and cast(Self, flow).loan.postponed_date <= date.today
        ],
    )
    def return_book(self):
        pass

    @state.transition(
        source=[LoanState.OBTENDED.value, LoanState.POSTPONED.value],
        target=LoanState.POSTPONED.value,
        conditions=[lambda flow: cast(Self, flow).loan.return_date >= date.today()],
    )
    def postponed(self, postponed_date):
        self.loan.postponed_date = postponed_date
