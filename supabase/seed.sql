-- Juegos iniciales del catálogo
insert into public.games (title, description, cover_url, genre, play_route) values
  ('Snake', 'El clásico juego de la serpiente. Come, crece, no choques.', null, 'Arcade', 'snake'),
  ('Memory Match', 'Encuentra las parejas de cartas antes de que se acabe el tiempo.', null, 'Puzzle', 'memory'),
  ('Tic-Tac-Toe', 'Tres en raya contra otro jugador o la máquina.', null, 'Estrategia', 'tic-tac-toe');
