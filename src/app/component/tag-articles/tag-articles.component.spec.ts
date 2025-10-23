import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagArticlesComponent } from './tag-articles.component';

describe('TagComponent', () => {
  let component: TagArticlesComponent;
  let fixture: ComponentFixture<TagArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagArticlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
