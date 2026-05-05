import { ImageService } from './image.service';

describe('ImageService', () => {
  it('should return a known image path', () => {
    const service = new ImageService();
    expect(service.getImage('a1')).toContain('assets/a1.jpg');
  });

  it('should return all images', () => {
    const service = new ImageService();
    const all = service.getAllImages();
    expect(all.length).toBeGreaterThan(5);
    expect(all.some(x => x.endsWith('/a.jpg') || x.endsWith('\\a.jpg'))).toBe(true);
  });

  it('should return random image from list', () => {
    const service = new ImageService();
    const all = service.getAllImages();
    const random = service.getRandomImage();
    expect(all.includes(random)).toBe(true);
  });

  it('should return base images', () => {
    const service = new ImageService();
    const base = service.getBaseImages();
    expect(base.length).toBe(14);
  });
});
