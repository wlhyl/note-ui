import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveArticlesComponent } from './archive-articles.component';

describe('ArchiveComponent', () => {
  let component: ArchiveArticlesComponent;
  let fixture: ComponentFixture<ArchiveArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveArticlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
