import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly basePath = 'assets/';

  // Images disponibles (a1-a5 et a-n)
  readonly images = {
    a1: `${this.basePath}a1.jpg`,
    a2: `${this.basePath}a2.jpg`,
    a3: `${this.basePath}a3.jpg`,
    a4: `${this.basePath}a4.jpg`,
    a5: `${this.basePath}a5.jpg`,
    a: `${this.basePath}a.jpg`,
    b: `${this.basePath}b.jpg`,
    c: `${this.basePath}c.jpg`,
    d: `${this.basePath}d.jpg`,
    e: `${this.basePath}e.jpg`,
    f: `${this.basePath}f.jpg`,
    g: `${this.basePath}g.jpg`,
    h: `${this.basePath}h.jpg`,
    i: `${this.basePath}i.jpg`,
    j: `${this.basePath}j.jpg`,
    k: `${this.basePath}k.jpg`,
    l: `${this.basePath}l.jpg`,
    m: `${this.basePath}m.jpg`,
    n: `${this.basePath}n.jpg`
  };

  // Récupérer une image par nom
  getImage(name: 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n'): string {
    return this.images[name];
  }

  // Récupérer toutes les images
  getAllImages(): string[] {
    return Object.values(this.images);
  }

  // Récupérer une image aléatoire
  getRandomImage(): string {
    const keys = Object.keys(this.images) as Array<keyof typeof this.images>;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return this.images[randomKey];
  }

  // Récupérer les images de base (a-n)
  getBaseImages(): string[] {
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']
      .map(key => this.images[key as keyof typeof this.images]);
  }
}
