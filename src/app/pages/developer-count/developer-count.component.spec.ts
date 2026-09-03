
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperCountComponent } from './developer-count.component';

describe('DeveloperCountComponent', () => {
    let component: DeveloperCountComponent;
    let fixture: ComponentFixture<DeveloperCountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeveloperCountComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DeveloperCountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
