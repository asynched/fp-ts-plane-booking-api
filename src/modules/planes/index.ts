import { Router } from 'express'
import * as TE from 'fp-ts/TaskEither'
import { pipe, identity } from 'fp-ts/function'
import { range } from 'fp-ts/lib/ReadonlyNonEmptyArray'

import Plane from '@/modules/planes/models'
import { createPlaneValidator } from '@/modules/planes/validators'

export const withRouter = (router: Router) => {
  router.get('/planes', (req, res) => {
    pipe(
      TE.tryCatch(async () => Plane.find({}).exec(), String),
      TE.bimap(
        (err) => res.status(500).json({ error: err }),
        (planes) => res.status(200).json(planes)
      )
    )()
  })

  router.post('/planes', (req, res) => {
    pipe(
      TE.tryCatch(() => createPlaneValidator.parseAsync(req.body), identity),
      TE.bimap(
        (err) => res.status(400).json({ error: err }),
        (payload) => {
          const seats = range(1, payload.seats).map((s) => ({
            number: s,
            available: true,
          }))

          const plane = new Plane({
            name: payload.name,
            seats,
          })

          pipe(
            TE.tryCatch(() => plane.save(), String),
            TE.bimap(
              (err) => res.status(500).json({ error: err }),
              (plane) => res.status(201).json(plane)
            )
          )()
        }
      )
    )()
  })

  router.get('/planes/:id', (req, res) => {
    pipe(
      TE.tryCatch(() => Plane.findById(req.params.id).exec(), String),
      TE.bimap(
        (err) => res.status(404).json({ error: err }),
        (plane) => res.status(200).json(plane)
      )
    )()
  })

  router.post('/planes/:id/book/:seatNumber', (req, res) => {
    pipe(
      TE.tryCatch(() => Plane.findById(req.params.id).exec(), String),
      TE.bimap(
        (err) => res.status(404).json({ error: err }),
        (plane) => {
          if (!plane) {
            return res.status(404).json({ error: 'Seat not found' })
          }

          const seat = plane.seats.find(
            (s) => s.number === Number(req.params.seatNumber)
          )

          if (!seat) {
            return res.status(404).json({ error: 'Seat not found' })
          }

          if (!seat.available) {
            return res.status(400).json({ error: 'Seat not available' })
          }

          seat.available = false

          pipe(
            TE.tryCatch(() => plane.save(), String),
            TE.bimap(
              (err) => res.status(500).json({ error: err }),
              (plane) => res.status(200).json(plane)
            )
          )()
        }
      )
    )()
  })
}
